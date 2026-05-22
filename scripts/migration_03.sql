-- RPC functions for reports

CREATE OR REPLACE FUNCTION get_productos_stock_bajo()
RETURNS TABLE(id uuid, nombre text, stock_actual int, stock_minimo int, codigo_sku text) AS $$
  SELECT id, nombre, stock_actual, stock_minimo, codigo_sku
  FROM productos
  WHERE stock_actual <= stock_minimo AND stock_minimo > 0
  ORDER BY (stock_actual::float / NULLIF(stock_minimo, 0)) ASC;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_productos_por_vencer()
RETURNS TABLE(id uuid, nombre text, stock_actual int, codigo_sku text) AS $$
  SELECT id, nombre, stock_actual, codigo_sku
  FROM productos
  WHERE stock_actual <= 5
  ORDER BY stock_actual ASC;
$$ LANGUAGE sql SECURITY DEFINER;
