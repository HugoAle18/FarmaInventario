-- Seed data para FarmaInventario

-- Categorias
INSERT INTO categorias (id, nombre, descripcion) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Analgésicos', 'Medicamentos para el dolor'),
  ('10000000-0000-0000-0000-000000000002', 'Antibióticos', 'Medicamentos antibacterianos'),
  ('10000000-0000-0000-0000-000000000003', 'Vitaminas', 'Suplementos vitamínicos'),
  ('10000000-0000-0000-0000-000000000004', 'Anti-inflamatorios', 'Medicamentos antiinflamatorios'),
  ('10000000-0000-0000-0000-000000000005', 'Endocrino', 'Medicamentos endocrinológicos');

-- Proveedores
INSERT INTO proveedores (id, nombre, contacto, telefono, email) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Distribuidora FarmaCorp', 'Carlos López', '999-888-777', 'carlos@farmacorp.com'),
  ('20000000-0000-0000-0000-000000000002', 'Laboratorios Pfizer', 'María García', '999-777-666', 'maria@pfizer.com'),
  ('20000000-0000-0000-0000-000000000003', 'Bayer Perú', 'Juan Pérez', '999-666-555', 'juan@bayer.pe');

-- Productos
INSERT INTO productos (id, codigo_sku, nombre, categoria_id, precio_venta, precio_costo, unidad_medida, laboratorio, stock_actual, stock_minimo) VALUES
  ('30000000-0000-0000-0000-000000000001', 'PAR-500-GEN', 'Paracetamol 500mg', '10000000-0000-0000-0000-000000000001', 12.50, 8.00, 'tableta', 'Genfar', 12, 20),
  ('30000000-0000-0000-0000-000000000002', 'AMOX-500', 'Amoxicilina 500mg', '10000000-0000-0000-0000-000000000002', 15.00, 9.50, 'cápsula', 'Pfizer', 450, 50),
  ('30000000-0000-0000-0000-000000000003', 'IBU-400-TAB', 'Ibuprofeno 400mg', '10000000-0000-0000-0000-000000000004', 8.75, 5.00, 'tableta', 'Bayer', 1200, 100),
  ('30000000-0000-0000-0000-000000000004', 'VIT-C-EFE', 'Vitamina C Eferv.', '10000000-0000-0000-0000-000000000003', 5.25, 3.00, 'efervescente', 'Roche', 120, 30),
  ('30000000-0000-0000-0000-000000000005', 'INS-LANTUS', 'Insulina Lantus', '10000000-0000-0000-0000-000000000005', 85.00, 60.00, 'pluma', 'Sanofi', 0, 5);

-- Lotes
INSERT INTO lotes (id, producto_id, proveedor_id, codigo_lote, cantidad_inicial, cantidad_actual, fecha_vencimiento, fecha_recepcion) VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'L993822', 500, 450, '2026-12-01', '2024-06-15'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'L882104', 100, 12, '2025-08-01', '2024-01-10'),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', 'L771221', 200, 120, '2024-05-01', '2023-11-20');
