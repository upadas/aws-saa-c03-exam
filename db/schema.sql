-- AWS SAA-C03 quiz content schema.
-- Designed for Supabase and plain PostgreSQL. The app can keep using the
-- local generated bank while this schema stores the same content server-side.

begin;

create table if not exists public.saa_domains (
  domain_id text primary key,
  short_name text not null,
  exam_weight integer not null check (exam_weight > 0),
  exam_question_count integer not null check (exam_question_count > 0),
  practice_question_count integer not null check (practice_question_count > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saa_objectives (
  objective_id text primary key,
  objective_name text not null,
  domain_id text not null references public.saa_domains(domain_id) on update cascade,
  service text not null,
  trigger text not null,
  source_domain text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saa_questions (
  question_id text primary key,
  objective_id text not null references public.saa_objectives(objective_id) on delete cascade on update cascade,
  variant integer not null check (variant between 1 and 5),
  domain_id text not null references public.saa_domains(domain_id) on update cascade,
  service text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  response_type text not null check (response_type in ('single', 'multiple')),
  prompt text not null,
  answer_summary text not null,
  explanation text not null,
  trigger text not null,
  services text[] not null default '{}',
  tags text[] not null default '{}',
  source_domain text,
  source_correct_option_ids text[] not null default '{}',
  adaptive jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saa_questions_objective_variant_unique unique (objective_id, variant)
);

create table if not exists public.saa_question_options (
  question_id text not null references public.saa_questions(question_id) on delete cascade on update cascade,
  option_id text not null,
  display_order integer not null check (display_order >= 1),
  original_index integer not null check (original_index >= 0),
  option_text text not null,
  is_correct boolean not null default false,
  explanation text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (question_id, option_id),
  constraint saa_question_options_display_unique unique (question_id, display_order)
);

create table if not exists public.saa_practice_sets (
  set_id text primary key,
  name text not null,
  description text not null,
  question_count integer not null check (question_count = 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saa_practice_set_questions (
  set_id text not null references public.saa_practice_sets(set_id) on delete cascade on update cascade,
  question_id text not null references public.saa_questions(question_id) on delete restrict on update cascade,
  position integer not null check (position between 1 and 10),
  primary key (set_id, position),
  constraint saa_practice_set_questions_unique_question unique (set_id, question_id)
);

create table if not exists public.saa_exam_forms (
  exam_id text primary key,
  name text not null,
  description text not null,
  question_count integer not null check (question_count = 65),
  duration_seconds integer not null default 7800 check (duration_seconds = 7800),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saa_exam_form_questions (
  exam_id text not null references public.saa_exam_forms(exam_id) on delete cascade on update cascade,
  question_id text not null references public.saa_questions(question_id) on delete restrict on update cascade,
  position integer not null check (position between 1 and 65),
  primary key (exam_id, position),
  constraint saa_exam_form_questions_unique_question_per_exam unique (exam_id, question_id),
  constraint saa_exam_form_questions_global_unique_question unique (question_id)
);

create index if not exists saa_objectives_domain_idx on public.saa_objectives(domain_id);
create index if not exists saa_questions_domain_idx on public.saa_questions(domain_id);
create index if not exists saa_questions_objective_idx on public.saa_questions(objective_id);
create index if not exists saa_questions_service_idx on public.saa_questions(service);
create index if not exists saa_questions_difficulty_idx on public.saa_questions(difficulty);
create index if not exists saa_question_options_question_idx on public.saa_question_options(question_id);
create index if not exists saa_practice_set_questions_question_idx on public.saa_practice_set_questions(question_id);
create index if not exists saa_exam_form_questions_exam_idx on public.saa_exam_form_questions(exam_id);

create or replace view public.saa_question_bank as
select
  q.question_id as id,
  q.objective_id,
  o.objective_name,
  q.domain_id as domain,
  d.short_name as domain_short_name,
  q.service,
  q.difficulty,
  q.response_type as type,
  q.prompt as question,
  q.answer_summary,
  q.explanation,
  q.trigger,
  q.variant,
  q.services,
  q.tags,
  q.source_domain,
  q.source_correct_option_ids,
  q.adaptive,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', qo.option_id,
        'text', qo.option_text,
        'correct', qo.is_correct,
        'explanation', qo.explanation,
        'originalIndex', qo.original_index
      )
      order by qo.display_order
    )
    from public.saa_question_options qo
    where qo.question_id = q.question_id
  ), '[]'::jsonb) as options
from public.saa_questions q
join public.saa_objectives o on o.objective_id = q.objective_id
join public.saa_domains d on d.domain_id = q.domain_id;

alter table public.saa_domains enable row level security;
alter table public.saa_objectives enable row level security;
alter table public.saa_questions enable row level security;
alter table public.saa_question_options enable row level security;
alter table public.saa_practice_sets enable row level security;
alter table public.saa_practice_set_questions enable row level security;
alter table public.saa_exam_forms enable row level security;
alter table public.saa_exam_form_questions enable row level security;

drop policy if exists "Read SAA domains" on public.saa_domains;
create policy "Read SAA domains" on public.saa_domains for select using (true);

drop policy if exists "Read SAA objectives" on public.saa_objectives;
create policy "Read SAA objectives" on public.saa_objectives for select using (true);

drop policy if exists "Read SAA questions" on public.saa_questions;
create policy "Read SAA questions" on public.saa_questions for select using (true);

drop policy if exists "Read SAA question options" on public.saa_question_options;
create policy "Read SAA question options" on public.saa_question_options for select using (true);

drop policy if exists "Read SAA practice sets" on public.saa_practice_sets;
create policy "Read SAA practice sets" on public.saa_practice_sets for select using (true);

drop policy if exists "Read SAA practice set questions" on public.saa_practice_set_questions;
create policy "Read SAA practice set questions" on public.saa_practice_set_questions for select using (true);

drop policy if exists "Read SAA exam forms" on public.saa_exam_forms;
create policy "Read SAA exam forms" on public.saa_exam_forms for select using (true);

drop policy if exists "Read SAA exam form questions" on public.saa_exam_form_questions;
create policy "Read SAA exam form questions" on public.saa_exam_form_questions for select using (true);

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    grant usage on schema public to anon;
    grant select on
      public.saa_domains,
      public.saa_objectives,
      public.saa_questions,
      public.saa_question_options,
      public.saa_practice_sets,
      public.saa_practice_set_questions,
      public.saa_exam_forms,
      public.saa_exam_form_questions,
      public.saa_question_bank
    to anon;
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant usage on schema public to authenticated;
    grant select on
      public.saa_domains,
      public.saa_objectives,
      public.saa_questions,
      public.saa_question_options,
      public.saa_practice_sets,
      public.saa_practice_set_questions,
      public.saa_exam_forms,
      public.saa_exam_form_questions,
      public.saa_question_bank
    to authenticated;
  end if;
end $$;

commit;
