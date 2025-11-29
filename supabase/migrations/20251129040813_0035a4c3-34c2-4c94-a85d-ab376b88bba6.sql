-- Grant steward role to joshuanesbit@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('f42046b2-67af-4990-b0ab-badeca92adc1', 'steward')
ON CONFLICT (user_id, role) DO NOTHING;