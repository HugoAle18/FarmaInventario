-- Migration 02: Proveedores RUC/notas + Ventas + trigger stock

ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS ruc text;
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS notas text;
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;

CREATE TABLE IF NOT EXISTS ventas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  total decimal(10,2) NOT NULL,
  usuario_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS detalle_ventas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  venta_id uuid REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id),
  cantidad integer NOT NULL,
  precio_unitario decimal(10,2) NOT NULL
);

CREATE OR REPLACE FUNCTION descontar_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE productos 
  SET stock_actual = stock_actual - NEW.cantidad
  WHERE id = NEW.producto_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_descontar_stock ON detalle_ventas;
CREATE TRIGGER trigger_descontar_stock
AFTER INSERT ON detalle_ventas
FOR EACH ROW EXECUTE FUNCTION descontar_stock();
