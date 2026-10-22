import { useMemo, useState } from 'react';
import { Database, Settings, Trash2, UserPlus, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import DemoTag from '@/components/DemoTag';
import EmptyState, { LoadingState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useList } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { useSession } from '@/lib/useSession';
import { dateStr, num } from '@/lib/format';
import { base44 } from '@/api/base44Client';

const CONFIG = [
  { key: 'Farm', ar: 'المزارع', en: 'Farms', cols: [['name', 'الاسم', 'Name'], ['region', 'المنطقة', 'Region'], ['palm_count', 'عدد النخيل', 'Palms'], ['irrigation_type', 'الري', 'Irrigation']] },
  { key: 'Palm', ar: 'النخيل', en: 'Palms', cols: [['palm_identifier', 'المعرّف', 'ID'], ['farm_name', 'المزرعة', 'Farm'], ['health_score', 'الصحة', 'Health'], ['rpw_risk', 'خطر السوسة', 'RPW']] },
  { key: 'SensorReading', ar: 'قراءات الاستشعار', en: 'Sensor readings', cols: [['palm_identifier', 'النخلة', 'Palm'], ['electrical_activity', 'كهربائي', 'Electrical'], ['acoustic_activity', 'صوتي', 'Acoustic'], ['soil_moisture', 'الرطوبة', 'Soil %']] },
  { key: 'WasteRecord', ar: 'المخلفات', en: 'Waste records', cols: [['waste_code', 'المعرّف', 'ID'], ['farm_name', 'المزرعة', 'Farm'], ['waste_type', 'النوع', 'Type'], ['quantity_tons', 'الكمية', 'Tons'], ['status', 'الحالة', 'Status']] },
  { key: 'CollectionRequest', ar: 'طلبات الجمع', en: 'Collection requests', cols: [['request_code', 'الطلب', 'Request'], ['farm_name', 'المزرعة', 'Farm'], ['facility_name', 'المنشأة', 'Facility'], ['status', 'الحالة', 'Status']] },
  { key: 'RecyclingFacility', ar: 'منشآت التدوير', en: 'Facilities', cols: [['name', 'الاسم', 'Name'], ['region', 'المنطقة', 'Region'], ['capacity_tons', 'السعة', 'Capacity'], ['status', 'الحالة', 'Status']] },
  { key: 'Product', ar: 'المنتجات', en: 'Products', cols: [['name_ar', 'المنتج', 'Product'], ['category', 'الفئة', 'Category'], ['price', 'السعر', 'Price'], ['inventory', 'المخزون', 'Inventory']] },
  { key: 'Alert', ar: 'التنبيهات', en: 'Alerts', cols: [['alert_code', 'المعرّف', 'ID'], ['title', 'العنوان', 'Title'], ['severity', 'الخطورة', 'Severity'], ['status', 'الحالة', 'Status']] },
  { key: 'Inspection', ar: 'الفحوصات', en: 'Inspections', cols: [['inspection_code', 'الطلب', 'Request'], ['palm_identifier', 'النخلة', 'Palm'], ['priority', 'الأولوية', 'Priority'], ['status', 'الحالة', 'Status']] },
];

export default function Admin() {
  const { L, isAr } = useLang();
  const { toast } = useToast();
  const { role } = useSession();
  const [entity, setEntity] = useState('Farm');
  const [q, setQ] = useState('');
  const [invite, setInvite] = useState({ email: '', role: 'user' });
  const [inviting, setInviting] = useState(false);

  const config = CONFIG.find((c) => c.key === entity);
  const { items, loading, reload } = useList(entity, {}, { limit: 60, sort: '-created_date' });
  const { items: users } = useList('User', {}, { limit: 50, sort: '-created_date' });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((row) => JSON.stringify(row).toLowerCase().includes(term));
  }, [items, q]);

  const isAdmin = role === 'admin';

  const remove = async (row) => {
    try {
      await base44.entities[entity].delete(row.id);
      toast({ title: L('تم حذف السجل', 'Record deleted') });
      reload();
    } catch (e) {
      toast({ title: L('تعذر حذف السجل', 'Could not delete the record'), variant: 'destructive' });
    }
  };

  const sendInvite = async () => {
    if (!invite.email) return;
    setInviting(true);
    try {
      await base44.users.inviteUser(invite.email, invite.role);
      toast({ title: L('تم إرسال الدعوة', 'Invitation sent'), description: `${invite.email} · ${invite.role}` });
      setInvite({ email: '', role: 'user' });
    } catch (e) {
      toast({ title: L('تعذر إرسال الدعوة', 'Could not send the invitation'), variant: 'destructive' });
    } finally {
      setInviting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-5">
        <PageHeader eyebrow={L('إدارة المنصة', 'PLATFORM ADMIN')} title={L('لوحة الإدارة', 'Admin')} />
        <EmptyState
          icon={Settings}
          title={L('هذه اللوحة مخصصة لمدير المنصة', 'This dashboard is for the platform administrator')}
          body={L('اختر دور «مدير المنصة» من شاشة الدخول للاطلاع على إدارة البيانات والمستخدمين.', 'Choose the “Administrator” role from the access screen to manage data and users.')}
          action={<Button asChild className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid"><a href="/access">{L('تغيير الدور', 'Change role')}</a></Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={L('إدارة المنصة', 'PLATFORM ADMIN')}
        title={L('لوحة الإدارة', 'Admin')}
        subtitle={L('إدارة المستخدمين والمزارع والنخيل وقراءات الاستشعار والمخلفات والطلبات والمنشآت والمنتجات والتنبيهات والفحوصات.', 'Manage users, farms, palms, sensor readings, waste, requests, facilities, products, alerts and inspections.')}
        actions={<DemoTag text={L('صلاحيات المدير', 'Admin access')} />}
      />

      <Panel title={L('دعوة مستخدم', 'Invite a user')} icon={UserPlus} subtitle={L('الدعوة تُرسل بالبريد من المنصة.', 'The invitation is emailed by the platform.')}>
        <div className="flex flex-wrap items-center gap-3">
          <Input value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="name@example.com" className="h-10 w-full text-xs sm:w-72" />
          <Select value={invite.role} onValueChange={(v) => setInvite({ ...invite, role: v })}>
            <SelectTrigger className="h-10 w-full text-xs sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="user" className="text-xs">{L('مستخدم', 'User')}</SelectItem>
              <SelectItem value="admin" className="text-xs">{L('مدير', 'Admin')}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={sendInvite} disabled={inviting} className="bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
            {inviting ? L('جاري الإرسال…', 'Sending…') : L('إرسال الدعوة', 'Send invitation')}
          </Button>
        </div>
        <p className="mt-3 text-[10px] text-safa-ink/45">
          {L('يمكن للمدير رؤية وتعديل كل البيانات وإدارة المستخدمين.', 'Admins can view and change all data and manage users.')}
        </p>
      </Panel>

      <Panel title={L('مستخدمو المنصة', 'Platform users')} icon={Users} subtitle={`${users.length} ${L('مستخدم', 'users')}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-[11px]">
            <thead>
              <tr className="text-safa-ink/45">
                <th className="pb-3 text-start font-normal">{L('الاسم', 'Name')}</th>
                <th className="pb-3 text-start font-normal">{L('البريد', 'Email')}</th>
                <th className="pb-3 text-start font-normal">{L('الدور', 'Role')}</th>
                <th className="pb-3 text-start font-normal">{L('الانضمام', 'Joined')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-safa-line/60">
                  <td className="py-3 text-safa-ink/70">{u.full_name || '—'}</td>
                  <td className="py-3 text-safa-ink/70">{u.email}</td>
                  <td className="py-3 text-safa-palm">{u.role}</td>
                  <td className="py-3 text-safa-ink/50">{dateStr(u.created_date, isAr ? 'ar' : 'en', true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={L('إدارة البيانات', 'Data management')} icon={Database}>
        <Tabs value={entity} onValueChange={setEntity}>
          <TabsList className="mb-4 flex w-full flex-wrap justify-start gap-1 bg-safa-mist p-1">
            {CONFIG.map((c) => (
              <TabsTrigger key={c.key} value={c.key} className="text-[11px]">
                {isAr ? c.ar : c.en}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L('بحث داخل السجلات…', 'Search records…')} className="mb-4 h-9 w-full text-xs sm:w-72" />

        {loading ? <LoadingState /> : null}
        {!loading && !filtered.length ? <EmptyState title={L('لا توجد بيانات كافية بعد', 'Not enough data yet')} /> : null}

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-[11px]">
              <thead>
                <tr className="text-safa-ink/45">
                  {config.cols.map((c) => (
                    <th key={c[0]} className="pb-3 text-start font-normal">{isAr ? c[1] : c[2]}</th>
                  ))}
                  <th className="pb-3 text-end font-normal">{L('إجراء', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 25).map((row) => (
                  <tr key={row.id} className="border-t border-safa-line/60">
                    {config.cols.map((c) => (
                      <td key={c[0]} className="py-3 text-safa-ink/70">
                        {typeof row[c[0]] === 'number' ? num(row[c[0]], row[c[0]] % 1 === 0 ? 0 : 2) : String(row[c[0]] ?? '—').slice(0, 42)}
                      </td>
                    ))}
                    <td className="py-3 text-end">
                      <Button size="sm" variant="outline" className="border-safa-dangerLine text-safa-dangerFg" onClick={() => remove(row)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="mt-4 text-[10px] text-safa-ink/45">
          {L('يُعرض حتى 25 سجلاً في كل صفحة إدارة.', 'Up to 25 records are shown per management view.')}
        </p>
      </Panel>
    </div>
  );
}