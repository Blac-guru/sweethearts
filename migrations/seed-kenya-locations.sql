-- Seed Kenya location data
-- Counties
INSERT INTO counties (id, name, code) VALUES
(1, 'Nairobi', '047'),
(2, 'Mombasa', '001'),
(3, 'Kisumu', '042'),
(4, 'Nakuru', '032'),
(5, 'Kiambu', '022'),
(6, 'Machakos', '016'),
(7, 'Kajiado', '034'),
(8, 'Uasin Gishu', '027'),
(9, 'Murang''a', '021'),
(10, 'Nyeri', '019');

-- Sub-counties for Nairobi
INSERT INTO sub_counties (id, name, countyId) VALUES
(1, 'Westlands', 1),
(2, 'Kasarani', 1),
(3, 'Embakasi', 1),
(4, 'Dagoretti', 1),
(5, 'Langata', 1),
(6, 'Starehe', 1),
(7, 'Kamukunji', 1),
(8, 'Makadara', 1);

-- Sub-counties for Mombasa
INSERT INTO sub_counties (id, name, countyId) VALUES
(9, 'Mvita', 2),
(10, 'Changamwe', 2),
(11, 'Jomba', 2),
(12, 'Kisauni', 2),
(13, 'Nyali', 2),
(14, 'Likoni', 2);

-- Sub-counties for Kisumu
INSERT INTO sub_counties (id, name, countyId) VALUES
(15, 'Kisumu Central', 3),
(16, 'Kisumu East', 3),
(17, 'Kisumu West', 3),
(18, 'Seme', 3),
(19, 'Nyando', 3),
(20, 'Muhoroni', 3);

-- Sub-counties for Nakuru
INSERT INTO sub_counties (id, name, countyId) VALUES
(21, 'Nakuru Town East', 4),
(22, 'Nakuru Town West', 4),
(23, 'Bahati', 4),
(24, 'Gilgil', 4),
(25, 'Naivasha', 4),
(26, 'Molo', 4);

-- Sub-counties for Kiambu
INSERT INTO sub_counties (id, name, countyId) VALUES
(27, 'Thika Town', 5),
(28, 'Ruiru', 5),
(29, 'Juja', 5),
(30, 'Kiambu', 5),
(31, 'Kiambaa', 5),
(32, 'Kabete', 5);

-- Constituencies for Nairobi sub-counties
INSERT INTO constituencies (id, name, subCountyId) VALUES
(1, 'Westlands', 1),
(2, 'Kasarani', 2),
(3, 'Embakasi East', 3),
(4, 'Embakasi West', 3),
(5, 'Embakasi North', 3),
(6, 'Embakasi South', 3),
(7, 'Embakasi Central', 3),
(8, 'Dagoretti North', 4),
(9, 'Dagoretti South', 4),
(10, 'Langata', 5),
(11, 'Kibra', 5),
(12, 'Starehe', 6),
(13, 'Mathare', 6),
(14, 'Kamukunji', 7),
(15, 'Makadara', 8);

-- Constituencies for Mombasa sub-counties
INSERT INTO constituencies (id, name, subCountyId) VALUES
(16, 'Mvita', 9),
(17, 'Changamwe', 10),
(18, 'Jomba', 11),
(19, 'Kisauni', 12),
(20, 'Nyali', 13),
(21, 'Likoni', 14);

-- Constituencies for Kisumu sub-counties
INSERT INTO constituencies (id, name, subCountyId) VALUES
(22, 'Kisumu Central', 15),
(23, 'Kisumu East', 16),
(24, 'Kisumu West', 17),
(25, 'Seme', 18),
(26, 'Nyando', 19),
(27, 'Muhoroni', 20);

-- Constituencies for Nakuru sub-counties
INSERT INTO constituencies (id, name, subCountyId) VALUES
(28, 'Nakuru Town East', 21),
(29, 'Nakuru Town West', 22),
(30, 'Bahati', 23),
(31, 'Gilgil', 24),
(32, 'Naivasha', 25),
(33, 'Molo', 26);

-- Constituencies for Kiambu sub-counties
INSERT INTO constituencies (id, name, subCountyId) VALUES
(34, 'Thika Town', 27),
(35, 'Ruiru', 28),
(36, 'Juja', 29),
(37, 'Kiambu', 30),
(38, 'Kiambaa', 31),
(39, 'Kabete', 32);
