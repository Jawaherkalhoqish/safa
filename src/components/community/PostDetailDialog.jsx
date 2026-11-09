import { useState } from 'react';
import { Building2, Mail, MapPin, Phone, ThumbsUp, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StatusBadge from '@/components/StatusBadge';
import { useLang } from '@/lib/i18n';
import { AUTHOR_ROLE, POST_CATEGORY, POST_STATUS, regionLabel } from '@/lib/community';

export default function PostDetailDialog({ post, onClose, onChanged }) {
  const { L, isAr } = useLang();
  const [saving, setSaving] = useState(false);
  if (!post) return null;

  const category = POST_CATEGORY[post.category] || POST_CATEGORY.knowledge;
  const status = POST_STATUS[post.status] || POST_STATUS.open;
  const role = AUTHOR_ROLE[post.author_role] || AUTHOR_ROLE.farmer;
  const contact = post.contact || '';

  const expressInterest = async () => {
    setSaving(true);
    try {
      await base44.entities.CommunityPost.update(post.id, { interest_count: (post.interest_count || 0) + 1 });
      onChanged?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={category.tone} label={L(category.ar, category.en)} />
            <StatusBadge tone={status.tone} label={L(status.ar, status.en)} />
            <span className="text-[10px] text-safa-earth">{post.post_code}</span>
          </div>
          <DialogTitle className="mt-2 text-lg leading-snug">
            {isAr ? post.title : post.title_en || post.title}
          </DialogTitle>
        </DialogHeader>

        <p className="whitespace-pre-line text-[13px] leading-relaxed text-safa-ink/75">
          {isAr ? post.body : post.body_en || post.body}
        </p>

        <div className="grid gap-3 rounded-2xl border border-safa-line bg-safa-mist/50 p-4 text-[12px] text-safa-ink/70 sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-safa-oliveSoft" />
            {isAr ? post.author_name : post.author_name_en || post.author_name}
            <span className="text-safa-ink/45">· {L(role.ar, role.en)}</span>
          </p>
          {post.organization ? (
            <p className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-safa-oliveSoft" />
              {isAr ? post.organization : post.organization_en || post.organization}
            </p>
          ) : null}
          {post.region ? (
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-safa-oliveSoft" />
              {regionLabel(post.region, isAr)}
            </p>
          ) : null}
          <p className="flex items-center gap-2">
            <ThumbsUp className="h-3.5 w-3.5 text-safa-oliveSoft" />
            {L(`${post.interest_count || 0} مهتم`, `${post.interest_count || 0} interested`)}
          </p>
        </div>

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-safa-line bg-white px-2.5 py-1 text-[10.5px] text-safa-earth">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t border-safa-line pt-4">
          {contact ? (
            <a
              href={contact.includes('@') ? `mailto:${contact}` : `tel:${contact}`}
              className="inline-flex items-center gap-2 rounded-full bg-safa-palm px-5 py-2.5 text-xs font-semibold text-safa-bone transition hover:bg-safa-palmMid"
            >
              {contact.includes('@') ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
              {L('تواصل مع الناشر', 'Contact author')}
            </a>
          ) : null}
          <Button onClick={expressInterest} disabled={saving} variant="outline" className="rounded-full border-safa-line text-xs text-safa-palm">
            <ThumbsUp className="h-3.5 w-3.5" />
            {L('أبديت الاهتمام', 'Express interest')}
          </Button>
          <Button variant="ghost" onClick={onClose} className="rounded-full text-xs text-safa-ink/60">
            {L('إغلاق', 'Close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}