export interface Producto {
  id: string
  codigo_sku: string
  nombre: string
  descripcion?: string
  categoria_id: string
  categoria_nombre?: string
  precio_venta: number
  precio_costo: number
  unidad_medida: string
  laboratorio?: string
  stock_actual: number
  stock_minimo: number
  stock_maximo?: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Categoria {
  id: string
  nombre: string
  descripcion?: string
  created_at: string
}

export interface Lote {
  id: string
  producto_id: string
  producto_nombre?: string
  codigo_lote: string
  cantidad_inicial: number
  cantidad_actual: number
  fecha_vencimiento: string
  fecha_recepcion: string
  proveedor_id?: string
  proveedor_nombre?: string
  created_at: string
}

export interface MovimientoStock {
  id: string
  producto_id: string
  producto_nombre?: string
  lote_id?: string
  tipo: "entrada" | "salida" | "ajuste"
  cantidad: number
  motivo?: string
  usuario_id: string
  usuario_nombre?: string
  referencia_tipo?: string
  referencia_id?: string
  created_at: string
}

export interface Proveedor {
  id: string
  nombre: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  created_at: string
}

export interface OrdenCompra {
  id: string
  proveedor_id: string
  proveedor_nombre?: string
  usuario_id: string
  usuario_nombre?: string
  fecha_orden: string
  fecha_esperada?: string
  estado: "pendiente" | "enviada" | "recibida" | "cancelada"
  notas?: string
  total: number
  created_at: string
}

export interface DetalleOrdenCompra {
  id: string
  orden_compra_id: string
  producto_id: string
  producto_nombre?: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Venta {
  id: string
  usuario_id: string
  usuario_nombre?: string
  cliente_nombre?: string
  cliente_documento?: string
  fecha_venta: string
  total: number
  metodo_pago: "efectivo" | "tarjeta" | "transferencia"
  created_at: string
}

export interface DetalleVenta {
  id: string
  venta_id: string
  producto_id: string
  producto_nombre?: string
  lote_id?: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface UsuarioFarmacia {
  id: string
  nombre: string
  email: string
  rol: "admin" | "farmaceutico" | "auxiliar"
  activo: boolean
  created_at: string
}

export interface Alerta {
  id: string
  tipo: "stock_bajo" | "lote_por_vencer" | "vencido"
  mensaje: string
  producto_id?: string
  producto_nombre?: string
  lote_id?: string
  leida: boolean
  created_at: string
}

export type StatusStock = "disponible" | "stock_bajo" | "agotado" | "vence_pronto"
