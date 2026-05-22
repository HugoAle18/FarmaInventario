-- RPC functions for reports

CREATE OR REPLACE FUNCTION get_productos_stock_bajo()
RETURNS TABLE(id uuid, nombre text, stock_actual int, stock_minimo int, codigo_sku text) AS $$
  SELECT id, nombre, stock_actual, stock_minimo, codigo_sku
  FROM productos
  WHERE stock_actual <= stock_minimo AND stock_minimo > 0
  ORDER BY (stock_actual::float / NULLIF(stock_minimo, 0)) ASC;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_productos_por_vencer()
RETURNS TABLE(id uuid, nombre text, codigo_lote text, fecha_vencimiento date) AS $$
  SELECT p.id, p.nombre, l.codigo_lote, l.fecha_vencimiento
  FROM lotes l
  JOIN productos p ON p.id = l.producto_id
  WHERE l.fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days'
    AND l.fecha_vencimiento >= CURRENT_DATE
  ORDER BY l.fecha_vencimiento ASC;
$$ LANGUAGE sql SECURITY DEFINER;
