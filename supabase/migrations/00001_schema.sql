-- FarmaInventario - Esquema de Base de Datos
-- Migración inicial

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIAS
-- ============================================================
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTOS
-- ============================================================
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_sku VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  precio_venta NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_costo NUMERIC(10,2) NOT NULL DEFAULT 0,
  unidad_medida VARCHAR(20) NOT NULL DEFAULT 'unidad',
  laboratorio VARCHAR(100),
  stock_actual INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 0,
  stock_maximo INTEGER,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_sku ON productos(codigo_sku);
CREATE INDEX idx_productos_activo ON productos(activo);

-- ============================================================
-- PROVEEDORES
-- ============================================================
CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  contacto VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LOTES
-- ============================================================
CREATE TABLE lotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  codigo_lote VARCHAR(100) NOT NULL,
  cantidad_inicial INTEGER NOT NULL DEFAULT 0,
  cantidad_actual INTEGER NOT NULL DEFAULT 0,
  fecha_vencimiento DATE NOT NULL,
  fecha_recepcion DATE NOT NULL DEFAULT CURRENT_DATE,
  proveedor_id UUID REFERENCES proveedores(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lotes_producto ON lotes(producto_id);
CREATE INDEX idx_lotes_vencimiento ON lotes(fecha_vencimiento);
CREATE INDEX idx_lotes_codigo ON lotes(codigo_lote);

-- ============================================================
-- USUARIOS FARMACIA
-- ============================================================
CREATE TABLE usuarios_farmacia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'auxiliar' CHECK (rol IN ('admin', 'farmaceutico', 'auxiliar')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MOVIMIENTOS STOCK
-- ============================================================
CREATE TABLE movimientos_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
  cantidad INTEGER NOT NULL,
  stock_resultante INTEGER NOT NULL,
  motivo TEXT,
  usuario_id UUID REFERENCES usuarios_farmacia(id) ON DELETE SET NULL,
  referencia_tipo VARCHAR(50),
  referencia_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movimientos_producto ON movimientos_stock(producto_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_stock(created_at);
CREATE INDEX idx_movimientos_tipo ON movimientos_stock(tipo);

-- ============================================================
-- ORDENES DE COMPRA
-- ============================================================
CREATE TABLE ordenes_compra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
  usuario_id UUID REFERENCES usuarios_farmacia(id) ON DELETE SET NULL,
  fecha_orden DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_esperada DATE,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviada', 'recibida', 'cancelada')),
  notas TEXT,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ordenes_estado ON ordenes_compra(estado);
CREATE INDEX idx_ordenes_proveedor ON ordenes_compra(proveedor_id);

-- ============================================================
-- DETALLE ORDEN DE COMPRA
-- ============================================================
CREATE TABLE detalle_orden_compra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE INDEX idx_detalle_oc ON detalle_orden_compra(orden_compra_id);

-- ============================================================
-- VENTAS
-- ============================================================
CREATE TABLE ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios_farmacia(id) ON DELETE SET NULL,
  cliente_nombre VARCHAR(200),
  cliente_documento VARCHAR(20),
  fecha_venta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  metodo_pago VARCHAR(20) NOT NULL DEFAULT 'efectivo' CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);

-- ============================================================
-- DETALLE VENTAS
-- ============================================================
CREATE TABLE detalle_ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
  lote_id UUID REFERENCES lotes(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE INDEX idx_detalle_venta ON detalle_ventas(venta_id);

-- ============================================================
-- ALERTAS
-- ============================================================
CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('stock_bajo', 'lote_por_vencer', 'vencido')),
  mensaje TEXT NOT NULL,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  lote_id UUID REFERENCES lotes(id) ON DELETE CASCADE,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alertas_leida ON alertas(leida);
CREATE INDEX idx_alertas_tipo ON alertas(tipo);

-- ============================================================
-- FUNCIÓN: Actualizar stock al insertar movimiento
-- ============================================================
CREATE OR REPLACE FUNCTION actualizar_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tipo = 'entrada' THEN
    UPDATE productos SET stock_actual = stock_actual + NEW.cantidad, updated_at = NOW() WHERE id = NEW.producto_id;
    UPDATE lotes SET cantidad_actual = cantidad_actual + NEW.cantidad WHERE id = NEW.lote_id;
  ELSIF NEW.tipo = 'salida' THEN
    UPDATE productos SET stock_actual = stock_actual - NEW.cantidad, updated_at = NOW() WHERE id = NEW.producto_id;
    UPDATE lotes SET cantidad_actual = cantidad_actual - NEW.cantidad WHERE id = NEW.lote_id;
  END IF;

  NEW.stock_resultante := (SELECT stock_actual FROM productos WHERE id = NEW.producto_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock
  BEFORE INSERT ON movimientos_stock
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_stock();

-- ============================================================
-- FUNCIÓN: Generar alerta automática de stock bajo
-- ============================================================
CREATE OR REPLACE FUNCTION verificar_stock_bajo()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_actual <= NEW.stock_minimo AND NEW.stock_minimo > 0 THEN
    INSERT INTO alertas (tipo, mensaje, producto_id)
    VALUES (
      'stock_bajo',
      'El producto "' || NEW.nombre || '" tiene stock bajo: ' || NEW.stock_actual || ' unidades (mínimo: ' || NEW.stock_minimo || ')',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_verificar_stock_bajo
  AFTER UPDATE OF stock_actual ON productos
  FOR EACH ROW
  WHEN (NEW.stock_actual <= NEW.stock_minimo)
  EXECUTE FUNCTION verificar_stock_bajo();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_orden_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_farmacia ENABLE ROW LEVEL SECURITY;

-- Políticas base: solo usuarios autenticados pueden leer
CREATE POLICY "Usuarios autenticados pueden leer" ON categorias FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON productos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON proveedores FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON lotes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON movimientos_stock FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON ordenes_compra FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON detalle_orden_compra FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON ventas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON detalle_ventas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer" ON alertas FOR SELECT USING (auth.role() = 'authenticated');

-- Admin tiene permisos totales
CREATE POLICY "Admin puede insertar" ON categorias FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede actualizar" ON categorias FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede eliminar" ON categorias FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede insertar" ON productos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede actualizar" ON productos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede eliminar" ON productos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede insertar" ON proveedores FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede actualizar" ON proveedores FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede eliminar" ON proveedores FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede insertar" ON lotes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede actualizar" ON lotes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede eliminar" ON lotes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede insertar" ON movimientos_stock FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin puede insertar" ON ordenes_compra FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede actualizar" ON ordenes_compra FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede eliminar" ON ordenes_compra FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede insertar" ON ventas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede actualizar" ON ventas FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede insertar" ON detalle_orden_compra FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede insertar" ON detalle_ventas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin puede actualizar" ON alertas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede eliminar" ON alertas FOR DELETE USING (auth.role() = 'authenticated');
