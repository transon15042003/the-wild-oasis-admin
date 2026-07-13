-- Demo reset RPC used by Edge Function reset-demo
create or replace function public.run_demo_reset(p_maintenance_minutes int default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_maintenance_until timestamptz := now() + make_interval(mins => p_maintenance_minutes);
  v_next_scheduled timestamptz := date_trunc('day', timezone('utc', now())) + interval '1 day';
  guest_ids bigint[];
  cabin_ids bigint[];
  g record;
  v_start timestamp;
  v_end timestamp;
  v_created timestamptz;
  v_nights int;
  v_cabin public.cabins%rowtype;
  v_cabin_price real;
  v_extras real;
  v_status text;
begin
  update public.demo_meta
  set maintenance_until = v_maintenance_until, updated_at = now()
  where id = 1;

  delete from public.bookings where id > 0;
  delete from public.guests where id > 0;
  delete from public.cabins where id > 0;

  insert into public.guests (full_name, email, nationality, national_id, country_flag) values
    ('Jonas Schmedtmann', 'hello@jonas.io', 'Portugal', '3525436345', 'https://flagcdn.com/pt.svg'),
    ('Jonathan Smith', 'johnsmith@test.eu', 'Great Britain', '4534593454', 'https://flagcdn.com/gb.svg'),
    ('Jonatan Johansson', 'jonatan@example.com', 'Finland', '9374074454', 'https://flagcdn.com/fi.svg'),
    ('Jonas Mueller', 'jonas@example.eu', 'Germany', '1233212288', 'https://flagcdn.com/de.svg'),
    ('Jonas Anderson', 'anderson@example.com', 'Bolivia (Plurinational State of)', '0988520146', 'https://flagcdn.com/bo.svg'),
    ('Jonathan Williams', 'jowi@gmail.com', 'United States of America', '633678543', 'https://flagcdn.com/us.svg'),
    ('Emma Watson', 'emma@gmail.com', 'United Kingdom', '1234578901', 'https://flagcdn.com/gb.svg'),
    ('Mohammed Ali', 'mohammedali@yahoo.com', 'Egypt', '987543210', 'https://flagcdn.com/eg.svg'),
    ('Maria Rodriguez', 'maria@gmail.com', 'Spain', '1098765321', 'https://flagcdn.com/es.svg'),
    ('Li Mei', 'li.mei@hotmail.com', 'China', '102934756', 'https://flagcdn.com/cn.svg'),
    ('Khadija Ahmed', 'khadija@gmail.com', 'Sudan', '1023457890', 'https://flagcdn.com/sd.svg'),
    ('Gabriel Silva', 'gabriel@gmail.com', 'Brazil', '109283465', 'https://flagcdn.com/br.svg'),
    ('Maria Gomez', 'maria@example.com', 'Mexico', '108765421', 'https://flagcdn.com/mx.svg'),
    ('Ahmed Hassan', 'ahmed@gmail.com', 'Egypt', '1077777777', 'https://flagcdn.com/eg.svg'),
    ('John Doe', 'johndoe@gmail.com', 'United States', '3245908744', 'https://flagcdn.com/us.svg'),
    ('Fatima Ahmed', 'fatima@example.com', 'Pakistan', '1089999363', 'https://flagcdn.com/pk.svg'),
    ('David Smith', 'david@gmail.com', 'Australia', '44450960283', 'https://flagcdn.com/au.svg'),
    ('Marie Dupont', 'marie@gmail.com', 'France', '06934233728', 'https://flagcdn.com/fr.svg'),
    ('Ramesh Patel', 'ramesh@gmail.com', 'India', '9875412303', 'https://flagcdn.com/in.svg'),
    ('Fatimah Al-Sayed', 'fatimah@gmail.com', 'Kuwait', '0123456789', 'https://flagcdn.com/kw.svg'),
    ('Nina Williams', 'nina@hotmail.com', 'South Africa', '2345678901', 'https://flagcdn.com/za.svg'),
    ('Taro Tanaka', 'taro@gmail.com', 'Japan', '3456789012', 'https://flagcdn.com/jp.svg'),
    ('Abdul Rahman', 'abdul@gmail.com', 'Saudi Arabia', '4567890123', 'https://flagcdn.com/sa.svg'),
    ('Julie Nguyen', 'julie@gmail.com', 'Vietnam', '5678901234', 'https://flagcdn.com/vn.svg'),
    ('Sara Lee', 'sara@gmail.com', 'South Korea', '6789012345', 'https://flagcdn.com/kr.svg'),
    ('Carlos Gomez', 'carlos@yahoo.com', 'Colombia', '7890123456', 'https://flagcdn.com/co.svg'),
    ('Emma Brown', 'emma@gmail.com', 'Canada', '8901234567', 'https://flagcdn.com/ca.svg'),
    ('Juan Hernandez', 'juan@yahoo.com', 'Argentina', '4343433333', 'https://flagcdn.com/ar.svg'),
    ('Ibrahim Ahmed', 'ibrahim@yahoo.com', 'Nigeria', '2345678009', 'https://flagcdn.com/ng.svg'),
    ('Mei Chen', 'mei@gmail.com', 'Taiwan', '3456117890', 'https://flagcdn.com/tw.svg');

  select array_agg(id order by id) into guest_ids from public.guests;

  insert into public.cabins (name, max_capacity, regular_price, discount, image, description) values
    ('001', 2, 250, 0, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-001.jpg', 'Discover the ultimate luxury getaway for couples in the cozy wooden cabin 001. Nestled in a picturesque forest, this stunning cabin offers a secluded and intimate retreat. Inside, enjoy modern high-quality wood interiors, a comfortable seating area, a fireplace and a fully-equipped kitchen. The plush king-size bed, dressed in fine linens guarantees a peaceful nights sleep. Relax in the spa-like shower and unwind on the private deck with hot tub.'),
    ('002', 2, 350, 25, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-002.jpg', 'Escape to the serenity of nature and indulge in luxury in our cozy cabin 002. Perfect for couples, this cabin offers a secluded and intimate retreat in the heart of a picturesque forest. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace and a fully-equipped kitchen. The luxurious bedroom features a plush king-size bed and spa-like shower. Relax on the private deck with hot tub and take in the beauty of nature.'),
    ('003', 4, 300, 0, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-003.jpg', 'Experience luxury family living in our medium-sized wooden cabin 003. Perfect for families of up to 4 people, this cabin offers a comfortable and inviting space with all modern amenities. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace, and a fully-equipped kitchen. The bedrooms feature plush beds and spa-like bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.'),
    ('004', 4, 500, 50, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-004.jpg', 'Indulge in the ultimate luxury family vacation in this medium-sized cabin 004. Designed for families of up to 4, this cabin offers a sumptuous retreat for the discerning traveler. Inside, the cabin boasts of opulent interiors crafted from the finest quality wood, a comfortable living area, a fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-inspired en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.'),
    ('005', 6, 350, 0, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-005.jpg', 'Enjoy a comfortable and cozy getaway with your group or family in our spacious cabin 005. Designed to accommodate up to 6 people, this cabin offers a secluded retreat in the heart of nature. Inside, the cabin features warm and inviting interiors crafted from quality wood, a living area with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. Step outside to your private deck and take in the natural surroundings while relaxing in your own hot tub.'),
    ('006', 6, 800, 100, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-006.jpg', 'Experience the epitome of luxury with your group or family in our spacious wooden cabin 006. Designed to comfortably accommodate up to 6 people, this cabin offers a lavish retreat in the heart of nature. Inside, the cabin features opulent interiors crafted from premium wood, a grand living area with fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-like en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.'),
    ('007', 8, 600, 100, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-007.jpg', 'Accommodate your large group or multiple families in the spacious and grand wooden cabin 007. Designed to comfortably fit up to 8 people, this cabin offers a secluded retreat in the heart of beautiful forests and mountains. Inside, the cabin features warm and inviting interiors crafted from quality wood, multiple living areas with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.'),
    ('008', 10, 1400, 0, 'https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/cabin-008.jpg', 'Experience the epitome of luxury and grandeur with your large group or multiple families in our grand cabin 008. This cabin offers a lavish retreat that caters to all your needs and desires. The cabin features an opulent design and boasts of high-end finishes, intricate details and the finest quality wood throughout. Inside, the cabin features multiple grand living areas with fireplaces, a formal dining area, and a gourmet kitchen that is a chef''s dream. The bedrooms are designed for ultimate comfort and luxury, with plush beds and en-suite spa-inspired bathrooms. Step outside and immerse yourself in the beauty of nature from your private deck, featuring a luxurious hot tub and ample seating areas for ultimate relaxation and enjoyment.');

  select array_agg(id order by id) into cabin_ids from public.cabins;

  for g in
    select * from jsonb_to_recordset('[{"created_at_days":-20,"created_at_with_time":true,"start_date_days":0,"end_date_days":7,"cabin_id":1,"guest_id":2,"has_breakfast":true,"observations":"I have a gluten allergy and would like to request a gluten-free breakfast.","is_paid":false,"num_guests":1},{"created_at_days":-33,"created_at_with_time":true,"start_date_days":-23,"end_date_days":-13,"cabin_id":1,"guest_id":3,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":2},{"created_at_days":-27,"created_at_with_time":true,"start_date_days":12,"end_date_days":18,"cabin_id":1,"guest_id":4,"has_breakfast":false,"observations":"","is_paid":false,"num_guests":2},{"created_at_days":-45,"created_at_with_time":true,"start_date_days":-45,"end_date_days":-29,"cabin_id":2,"guest_id":5,"has_breakfast":false,"observations":"","is_paid":true,"num_guests":2},{"created_at_days":-2,"created_at_with_time":true,"start_date_days":15,"end_date_days":18,"cabin_id":2,"guest_id":6,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":2},{"created_at_days":-5,"created_at_with_time":true,"start_date_days":33,"end_date_days":48,"cabin_id":2,"guest_id":7,"has_breakfast":true,"observations":"","is_paid":false,"num_guests":2},{"created_at_days":-65,"created_at_with_time":true,"start_date_days":-25,"end_date_days":-20,"cabin_id":3,"guest_id":8,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":4},{"created_at_days":-2,"created_at_with_time":true,"start_date_days":-2,"end_date_days":0,"cabin_id":3,"guest_id":9,"has_breakfast":false,"observations":"We will be bringing our small dog with us","is_paid":true,"num_guests":3},{"created_at_days":-14,"created_at_with_time":true,"start_date_days":-14,"end_date_days":-11,"cabin_id":3,"guest_id":10,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":4},{"created_at_days":-30,"created_at_with_time":true,"start_date_days":-4,"end_date_days":8,"cabin_id":4,"guest_id":11,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":4},{"created_at_days":-1,"created_at_with_time":true,"start_date_days":12,"end_date_days":17,"cabin_id":4,"guest_id":12,"has_breakfast":true,"observations":"","is_paid":false,"num_guests":4},{"created_at_days":-3,"created_at_with_time":true,"start_date_days":18,"end_date_days":19,"cabin_id":4,"guest_id":13,"has_breakfast":false,"observations":"","is_paid":true,"num_guests":1},{"created_at_days":0,"created_at_with_time":true,"start_date_days":14,"end_date_days":21,"cabin_id":5,"guest_id":14,"has_breakfast":true,"observations":"","is_paid":false,"num_guests":5},{"created_at_days":-6,"created_at_with_time":true,"start_date_days":-6,"end_date_days":-4,"cabin_id":5,"guest_id":15,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":4},{"created_at_days":-4,"created_at_with_time":true,"start_date_days":-4,"end_date_days":-1,"cabin_id":5,"guest_id":16,"has_breakfast":false,"observations":"","is_paid":true,"num_guests":6},{"created_at_days":-3,"created_at_with_time":true,"start_date_days":0,"end_date_days":11,"cabin_id":6,"guest_id":17,"has_breakfast":false,"observations":"We will be checking in late, around midnight. Hope that''s okay :)","is_paid":true,"num_guests":6},{"created_at_days":-16,"created_at_with_time":true,"start_date_days":-16,"end_date_days":-9,"cabin_id":6,"guest_id":18,"has_breakfast":true,"observations":"I will need a rollaway bed for one of the guests","is_paid":true,"num_guests":4},{"created_at_days":-18,"created_at_with_time":true,"start_date_days":-4,"end_date_days":-1,"cabin_id":6,"guest_id":19,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":6},{"created_at_days":-2,"created_at_with_time":true,"start_date_days":17,"end_date_days":23,"cabin_id":7,"guest_id":20,"has_breakfast":false,"observations":"","is_paid":false,"num_guests":8},{"created_at_days":-7,"created_at_with_time":true,"start_date_days":40,"end_date_days":50,"cabin_id":7,"guest_id":21,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":7},{"created_at_days":-55,"created_at_with_time":true,"start_date_days":32,"end_date_days":37,"cabin_id":7,"guest_id":22,"has_breakfast":true,"observations":"","is_paid":true,"num_guests":6},{"created_at_days":-8,"created_at_with_time":true,"start_date_days":-5,"end_date_days":0,"cabin_id":8,"guest_id":1,"has_breakfast":true,"observations":"My wife has a gluten allergy so I would like to request a gluten-free breakfast if possible","is_paid":true,"num_guests":9},{"created_at_days":0,"created_at_with_time":true,"start_date_days":0,"end_date_days":5,"cabin_id":8,"guest_id":23,"has_breakfast":true,"observations":"I am celebrating my anniversary, can you arrange for any special amenities or decorations?","is_paid":true,"num_guests":10},{"created_at_days":-10,"created_at_with_time":true,"start_date_days":10,"end_date_days":13,"cabin_id":8,"guest_id":24,"has_breakfast":false,"observations":"","is_paid":true,"num_guests":7}]'::jsonb)
      as x(
        created_at_days int,
        created_at_with_time boolean,
        start_date_days int,
        end_date_days int,
        cabin_id int,
        guest_id int,
        has_breakfast boolean,
        observations text,
        is_paid boolean,
        num_guests int
      )
  loop
    v_start := date_trunc('day', now()) + make_interval(days => g.start_date_days);
    v_end := date_trunc('day', now()) + make_interval(days => g.end_date_days);
    v_created := case when g.created_at_with_time
      then now() + make_interval(days => g.created_at_days)
      else date_trunc('day', now()) + make_interval(days => g.created_at_days) end;
    v_nights := greatest((v_end::date - v_start::date), 0);
    select * into v_cabin from public.cabins where id = cabin_ids[g.cabin_id];
    v_cabin_price := v_nights * (v_cabin.regular_price - v_cabin.discount);
    v_extras := case when g.has_breakfast then v_nights * 15 * g.num_guests else 0 end;
    if v_end::date < current_date then v_status := 'checked-out';
    elsif v_start::date >= current_date then v_status := 'unconfirmed';
    else v_status := 'checked-in';
    end if;

    insert into public.bookings (
      created_at, start_date, end_date, num_nights, num_guests,
      cabin_price, extras_price, total_price, status, has_breakfast,
      is_paid, observations, cabin_id, guest_id
    ) values (
      v_created, v_start, v_end, v_nights, g.num_guests,
      v_cabin_price, v_extras, v_cabin_price + v_extras, v_status, g.has_breakfast,
      g.is_paid, g.observations, cabin_ids[g.cabin_id], guest_ids[g.guest_id]
    );
  end loop;

  update public.settings set
    min_booking_length = 3,
    max_booking_length = 30,
    max_guests_per_booking = 10,
    breakfast_price = 15
  where id = 1;

  update public.demo_meta set
    maintenance_until = v_maintenance_until,
    last_reset_at = now(),
    next_scheduled_reset_at = v_next_scheduled,
    updated_at = now()
  where id = 1;

  return jsonb_build_object(
    'ok', true,
    'maintenance_until', v_maintenance_until,
    'next_scheduled_reset_at', v_next_scheduled,
    'guests', coalesce(array_length(guest_ids,1),0),
    'cabins', coalesce(array_length(cabin_ids,1),0)
  );
end;
$$;

revoke all on function public.run_demo_reset(int) from public;
grant execute on function public.run_demo_reset(int) to service_role;
