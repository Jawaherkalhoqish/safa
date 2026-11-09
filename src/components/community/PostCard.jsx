import { MapPin, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useLang } from '@/lib/i18n';
import { AUTHOR_ROLE, POST_CATEGORY, POST_STATUS, regionLabel } from '@/lib/community';

export default function PostCard({ post, onOpen }) {
  const { L, isAr } = useLang();
  const category = POST_CATEGORY[post.category] || POST_CATEGORY.knowledge;
  const status = POST_STATUS[post.status] || POST_STATUS.open;
  const role = AUTHOR_ROLE[post.author_role] || AUTHOR_ROLE.farmer;
  const title = isAr ? post.title : post.title_en || post.title;
  const body = isAr ? post.body : post.body_en || post.body;
  const author = isAr ? post.author_name : post.author_name_en || post.author_name;
  const organization = isAr ? post.organization : post.organization_en || post.organization;

  return (
    <button
      type="button"
      onClick={() => onOpen(post)}
      className="panel glow-card group flex h-full flex-col p-5 text-start"
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={category.tone} label={L(category.ar, category.en)} />
        <StatusBadge tone={status.tone} label={L(status.ar, status.en)} />
      </div>
      <h3 className="mt-3.5 text-[15px] font-semibold leading-snug text-safa-palm">{title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-safa-ink/65">{body}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-safa-ink/50">
        <span className="inline-flex items-center gap-1.5 font-medium text-safa-ink/70">
          <Users className="h-3.5 w-3.5 text-safa-oliveSoft" />
          {author} · {L(role.ar, role.en)}
        </span>
        {post.region ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {regionLabel(post.region, isAr)}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" />
          {post.interest_count || 0}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-safa-line/70 pt-3">
        <span className="truncate text-[11px] text-safa-earth">{organization || post.post_code}</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-safa-palm transition group-hover:gap-2">
          <MessageSquare className="h-3.5 w-3.5" />
          {L('التفاصيل', 'Details')}
        </span>
      </div>
    </button>
  );
}