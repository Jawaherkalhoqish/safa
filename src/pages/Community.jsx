import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Handshake, MapPin, MessageSquarePlus, Search, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import DemoTag from '@/components/DemoTag';
import PostCard from '@/components/community/PostCard';
import NewPostDialog from '@/components/community/NewPostDialog';
import PostDetailDialog from '@/components/community/PostDetailDialog';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { POST_CATEGORY, REGIONS, regionLabel } from '@/lib/community';
import { num } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function Community() {
  const { L, isAr } = useLang();
  const { items: posts, loading, reload } = useList('CommunityPost', {}, { limit: 120, sort: '-created_date' });
  const { items: facilities } = useList('RecyclingFacility', {}, { limit: 6, sort: 'name' });
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('all');
  const [q, setQ] = useState('');
  const [composing, setComposing] = useState(false);
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (region !== 'all' && p.region !== region) return false;
      if (!term) return true;
      return [p.title, p.title_en, p.body, p.body_en, p.author_name, p.organization, (p.tags || []).join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [posts, category, region, q]);

  const open = posts.filter((p) => p.status === 'open').length;
  const partners = posts.filter((p) => p.category === 'partnership' || p.category === 'opportunity').length;
  const members = new Set(posts.map((p) => p.organization || p.author_name)).size;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('المجتمع الزراعي', 'AGRICULTURAL COMMUNITY')}
        title={L('مجتمع سعفة الزراعي', 'SA’FA Agricultural Community')}
        subtitle={L(
          'مساحة مهنية تربط المزارعين والشركات والمنشآت: معرفة، احتياجات، خدمات، وفرص شراكة.',
          'A professional space connecting farmers, companies and facilities: knowledge, needs, services and partnership opportunities.'
        )}
        actions={
          <>
            <DemoTag />
            <Button onClick={() => setComposing(true)} className="rounded-full bg-safa-palm text-xs text-safa-bone hover:bg-safa-palmMid">
              <MessageSquarePlus className="h-3.5 w-3.5" />
              {L('مشاركة جديدة', 'New post')}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel glow-card p-5">
          <p className="text-[11px] text-safa-ink/50">{L('مشاركات مفتوحة', 'Open posts')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(open)}</p>
        </div>
        <div className="panel glow-card p-5">
          <p className="text-[11px] text-safa-ink/50">{L('فرص وشراكات', 'Opportunities & partnerships')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(partners)}</p>
        </div>
        <div className="panel glow-card p-5">
          <p className="text-[11px] text-safa-ink/50">{L('جهات مشاركة', 'Participating entities')}</p>
          <p className="display-num mt-2 text-3xl text-safa-palm">{num(members)}</p>
        </div>
      </div>

      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-safa-ink/40 start-3" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L('ابحث في المجتمع…', 'Search the community…')} className="h-9 ps-9 text-xs" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', category === 'all' ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/60')}
          >
            {L('كل الأنواع', 'All types')}
          </button>
          {Object.entries(POST_CATEGORY).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCategory(k)}
              className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', category === k ? 'border-safa-palm bg-safa-palm text-safa-cream' : 'border-safa-line bg-white text-safa-ink/60')}
            >
              {L(v.ar, v.en)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 sm:ms-auto">
          <button
            onClick={() => setRegion('all')}
            className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', region === 'all' ? 'border-safa-oliveSoft bg-safa-oliveSoft/15 text-safa-palm' : 'border-safa-line bg-white text-safa-ink/55')}
          >
            {L('كل المناطق', 'All regions')}
          </button>
          {REGIONS.slice(0, 3).map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={cn('rounded-full border px-3 py-1.5 text-[11px] transition', region === r.value ? 'border-safa-oliveSoft bg-safa-oliveSoft/15 text-safa-palm' : 'border-safa-line bg-white text-safa-ink/55')}
            >
              {isAr ? r.ar : r.en}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingState /> : null}
      {!loading && !filtered.length ? (
        <EmptyState
          icon={Users}
          title={L('لا توجد مشاركات مطابقة', 'No matching posts')}
          body={L('جرّب نوعًا أو منطقة أخرى، أو ابدأ أول مشاركة في المجتمع.', 'Try another type or region, or start the first post in the community.')}
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <PostCard key={p.id} post={p} onOpen={setActive} />
        ))}
      </div>

      <Panel
        title={L('كيف يعمل المجتمع', 'How the community works')}
        icon={Handshake}
        subtitle={L('علاقات مهنية منظمة، لا شبكة اجتماعية عامة', 'Organized professional relationships, not a general social feed')}
      >
        <div className="grid gap-3 text-[12.5px] leading-relaxed text-safa-ink/70 sm:grid-cols-3">
          <p className="rounded-xl border border-safa-line bg-safa-cream/70 p-3.5">
            {L('كل مشاركة مصنفة بنوعها ومنطقتها، فتصل إلى الطرف المناسب مباشرة.', 'Every post is classified by type and region so it reaches the right party directly.')}
          </p>
          <p className="rounded-xl border border-safa-line bg-safa-cream/70 p-3.5">
            {L('تظهر بيانات التواصل عند الحاجة فقط، لبناء علاقة عمل وليس متابعة.', 'Contact details appear only when needed, to build business relationships rather than follows.')}
          </p>
          <p className="rounded-xl border border-safa-line bg-safa-cream/70 p-3.5">
            {L('فرص الشراكة والاحتياجات مرتبطة بسلسلة المخلفات والتدوير.', 'Partnerships and needs are tied to the waste and recycling chain.')}
          </p>
        </div>
      </Panel>

      <Panel
        title={L('دليل المنشآت والخدمات', 'Facilities & services directory')}
        icon={Factory}
        subtitle={L('تعرّف على منشآت التدوير والمواد التي تستقبلها قبل التواصل', 'See recycling facilities and the materials they accept before you connect')}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <div key={f.id} className="rounded-xl border border-safa-line bg-white p-3.5">
              <p className="text-[12.5px] font-semibold text-safa-palm">{isAr ? f.name : f.name_en || f.name}</p>
              <p className="mt-1 flex items-center gap-1 text-[10.5px] text-safa-ink/50">
                <MapPin className="h-3 w-3" />
                {regionLabel(f.region, isAr)}
              </p>
              {f.accepted_materials?.length ? (
                <p className="mt-2 text-[11px] leading-relaxed text-safa-ink/60">{f.accepted_materials.join(' · ')}</p>
              ) : null}
              <Link to="/facility" className="mt-2.5 inline-flex text-[11px] font-medium text-safa-palm transition hover:underline">
                {L('عرض المنشأة', 'View facility')}
              </Link>
            </div>
          ))}
        </div>
      </Panel>

      <NewPostDialog open={composing} onOpenChange={setComposing} onCreated={reload} />
      <PostDetailDialog post={active} onClose={() => setActive(null)} onChanged={reload} />
      <p className="text-[10px] text-safa-ink/40">
        {L(
          `تُعرض مشاركات تجريبية للعرض فقط. المناطق المتاحة: ${REGIONS.map((r) => (isAr ? r.ar : r.en)).join(' · ')}.`,
          `Demo posts are shown for illustration. Available regions: ${REGIONS.map((r) => r.en).join(' · ')}.`
        )}
      </p>
    </div>
  );
}