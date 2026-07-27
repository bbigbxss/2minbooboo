alter table public.products
  add column if not exists original_price numeric;

update public.products
set original_price = case
  when lower(category) like '%mini%'
    and lower(category) not like '%medium%'
    and lower(name) like '%dahlia%' then 129
  when lower(category) like '%mini%'
    and lower(category) not like '%medium%' then 99

  when lower(category) like '%medium%'
    and (
      lower(name) like '%sakura%' or
      lower(name) like '%barbie%' or
      lower(name) like '%babie%'
    ) then 258
  when lower(category) like '%medium%'
    and lower(name) like '%moonlight%' then 318
  when lower(category) like '%medium%'
    and (
      lower(name) like '%songkran%' or
      lower(name) like '%somgkran%'
    ) then 376

  when (
      category like '%ใหญ่%' or
      lower(category) like '%large%' or
      lower(category) like '%full%'
    )
    and lower(name) like '%blooming%' then 378
  when (
      category like '%ใหญ่%' or
      lower(category) like '%large%' or
      lower(category) like '%full%'
    )
    and (
      lower(name) like '%bangkok%' or
      lower(name) like '%hollywood%' or
      lower(name) like '%california%'
    ) then 318
  else original_price
end
where original_price is null;

create or replace function public.admin_set_product_original_price(
  p_token uuid,
  p_product_id text,
  p_original_price numeric
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.admin_is_session(p_token) then
    raise exception 'Unauthorized';
  end if;

  update public.products
  set original_price = p_original_price,
      updated_at = now()
  where id = p_product_id;

  if not found then
    raise exception 'Product not found';
  end if;
end;
$$;
