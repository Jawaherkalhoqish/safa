import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { money, num, PRODUCT_CATEGORY, pick } from '@/lib/format';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const KEY = 'safa_cart';

export default function CartProvider({ children }) {
  const { L, lang } = useLang();
  const { toast } = useToast();
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      /* ignore */
    }
  }, [items]);

  const add = (product, quantity = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { product, quantity }];
    });
    toast({ title: L('تمت إضافة المنتج إلى السلة', 'Product added to cart'), description: lang === 'ar' ? product.name_ar : product.name_en });
  };

  const setQty = (id, quantity) =>
    setItems((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)));

  const remove = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id));

  const total = items.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const count = items.reduce((a, i) => a + i.quantity, 0);

  const checkout = async () => {
    if (!items.length) return;
    setPlacing(true);
    try {
      const code = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      await base44.entities.Order.bulkCreate(
        items.map((i) => ({
          order_code: code,
          buyer_name: buyerName || L('مشتري تجريبي', 'Demo buyer'),
          buyer_role: 'demo',
          product_id: i.product.id,
          product_name: lang === 'ar' ? i.product.name_ar : i.product.name_en,
          facility_name: i.product.facility_name,
          quantity: i.quantity,
          total: i.product.price * i.quantity,
          status: 'placed',
        }))
      );
      setItems([]);
      setOpen(false);
      toast({
        title: L('تم تأكيد الطلب', 'Order confirmed'),
        description: `${code} · ${money(total, lang)}`,
      });
    } catch (e) {
      toast({ title: L('تعذر إتمام الطلب', 'Could not place the order'), variant: 'destructive' });
    } finally {
      setPlacing(false);
    }
  };

  const value = useMemo(() => ({ items, add, remove, setQty, total, count, open, setOpen }), [items, open, total, count]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-safa-line px-5 py-4">
            <SheetTitle className="flex items-center justify-between text-sm font-semibold text-safa-palm">
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                {L('سلة متجر سعفة', 'SA’FA store cart')}
              </span>
              <button onClick={() => setOpen(false)} aria-label={L('إغلاق', 'Close')}>
                <X className="h-4 w-4 text-safa-ink/50" />
              </button>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {!items.length ? (
              <p className="py-10 text-center text-xs text-safa-ink/50">
                {L('سلتك فارغة. تصفّح منتجات الاقتصاد الدائري.', 'Your cart is empty. Browse circular products.')}
              </p>
            ) : null}
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.product.id} className="flex gap-3 rounded-2xl border border-safa-line bg-white p-3">
                  <img src={i.product.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-safa-ink">{lang === 'ar' ? i.product.name_ar : i.product.name_en}</p>
                    <p className="mt-0.5 text-[11px] text-safa-ink/50">{pick(PRODUCT_CATEGORY, i.product.category, lang)} · {i.product.facility_name}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => setQty(i.product.id, i.quantity - 1)} className="rounded-md border border-safa-line p-1" aria-label={L('تقليل', 'Decrease')}>
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs tabular-nums">{num(i.quantity)}</span>
                      <button onClick={() => setQty(i.product.id, i.quantity + 1)} className="rounded-md border border-safa-line p-1" aria-label={L('زيادة', 'Increase')}>
                        <Plus className="h-3 w-3" />
                      </button>
                      <span className="ms-auto text-xs font-semibold text-safa-palm">{money(i.product.price * i.quantity, lang)}</span>
                      <button onClick={() => remove(i.product.id)} className="text-safa-ink/40 transition hover:text-safa-dangerFg" aria-label={L('حذف', 'Remove')}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-safa-line px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-safa-ink/60">{L('الإجمالي', 'Total')}</span>
              <span className="display-num text-xl text-safa-palm">{money(total, lang)}</span>
            </div>
            <Input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder={L('الاسم للعرض في الطلب (اختياري)', 'Name shown on the order (optional)')}
              className="mt-3 text-xs"
            />
            <Button onClick={checkout} disabled={!items.length || placing} className="mt-3 w-full bg-safa-palm text-safa-cream hover:bg-safa-palmMid">
              {placing ? L('جاري تأكيد الطلب…', 'Placing order…') : L('إتمام الطلب', 'Complete order')}
            </Button>
            <Link to="/store" onClick={() => setOpen(false)} className="mt-3 block text-center text-[11px] text-safa-earth underline-offset-2 hover:underline">
              {L('متابعة التسوق', 'Continue shopping')}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </CartContext.Provider>
  );
}