import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Search } from 'lucide-react'
import { DownFillIcon } from '@/components/ui/icons/DownFillIcon'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { mockMarkets } from '@/mock-data/markets'

// ─── Token selector ──────────────────────────────────────────────────────────

interface TokenOption {
  value: string
  label: string
  logo: string
}

const TOKEN_OPTIONS: TokenOption[] = mockMarkets.map(m => ({
  value: m.token,
  label: m.name,
  logo: m.logo,
}))

interface TokenSelectProps {
  value: string
  onChange: (v: string) => void
  error?: string
}

const TokenSelect: React.FC<TokenSelectProps> = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = TOKEN_OPTIONS.filter(
    t =>
      t.value.toLowerCase().includes(search.toLowerCase()) ||
      t.label.toLowerCase().includes(search.toLowerCase()),
  )

  const selected = TOKEN_OPTIONS.find(t => t.value === value)

  return (
    <div className="relative">
      <label className="text-13 font-medium text-text-secondary mb-1.5 block">Token</label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={clsx(
          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-bg-surface',
          'text-14 transition-colors',
          error ? 'border-border-danger' : open ? 'border-border-active' : 'border-border-default hover:border-neutral-600',
        )}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span className="text-xl">{selected.logo}</span>
            <span className="text-text-primary font-medium">{selected.value}</span>
            <span className="text-text-muted text-13">{selected.label}</span>
          </span>
        ) : (
          <span className="text-text-muted">Select a token…</span>
        )}
        <DownFillIcon
          size={16}
          className={clsx('text-text-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {error && <p className="text-12 text-danger mt-1">{error}</p>}

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-bg-elevated border border-border-default rounded-xl shadow-modal overflow-hidden">
          <div className="p-2 border-b border-border-default">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-bg-surface border border-border-default">
              <Search size={14} className="text-text-muted shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search token…"
                className="flex-1 bg-transparent text-14 text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.map(t => (
              <li key={t.value}>
                <button
                  type="button"
                  onClick={() => { onChange(t.value); setOpen(false); setSearch('') }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-14 transition-colors',
                    t.value === value
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
                  )}
                >
                  <span className="text-xl">{t.logo}</span>
                  <span className="font-medium">{t.value}</span>
                  <span className="text-text-muted text-13 ml-auto">{t.label}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-14 text-text-muted text-center">No tokens found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  token: string
  type: 'buy' | 'sell'
  price: string
  amount: string
  minFill: string
  expiry: string
  notes: string
}

interface FormErrors {
  token?: string
  price?: string
  amount?: string
  expiry?: string
}

const EMPTY_FORM: FormState = {
  token: '',
  type: 'sell',
  price: '',
  amount: '',
  minFill: '',
  expiry: '',
  notes: '',
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  form: FormState
  total: number
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen, onClose, onConfirm, loading, form, total,
}) => {
  const rows = [
    { label: 'Token',      value: form.token || '—' },
    { label: 'Type',       value: <Badge label={form.type === 'buy' ? 'Buy' : 'Sell'} variant={form.type === 'buy' ? 'buy' : 'sell'} /> },
    { label: 'Price',      value: form.price ? `$${parseFloat(form.price).toFixed(4)} USDC` : '—' },
    { label: 'Amount',     value: form.amount ? `${parseInt(form.amount, 10).toLocaleString()} ${form.token}` : '—' },
    { label: 'Total Value',value: total > 0 ? `$${total.toFixed(2)} USDC` : '—' },
    { label: 'Min Fill',   value: form.minFill ? `${parseInt(form.minFill, 10).toLocaleString()} ${form.token}` : 'None' },
    { label: 'Expires',    value: form.expiry ? new Date(form.expiry).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Preview Listing"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>Edit</Button>
          <Button
            variant={form.type === 'buy' ? 'buy' : 'sell'}
            fullWidth
            loading={loading}
            onClick={onConfirm}
          >
            Confirm &amp; Submit
          </Button>
        </div>
      }
    >
      <div className="divide-y divide-border-default">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between py-3">
            <span className="text-14 text-text-muted">{row.label}</span>
            <span className="text-14 font-medium text-text-primary">{row.value}</span>
          </div>
        ))}
      </div>
      {form.notes && (
        <div className="mt-4 p-3 rounded-lg bg-bg-base border border-border-default">
          <p className="text-12 text-text-muted mb-1">Notes</p>
          <p className="text-13 text-text-secondary">{form.notes}</p>
        </div>
      )}
    </Modal>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [previewOpen, setPreviewOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const clearError = (key: keyof FormErrors) =>
    setErrors(prev => ({ ...prev, [key]: undefined }))

  const numPrice  = parseFloat(form.price) || 0
  const numAmount = parseFloat(form.amount) || 0
  const total     = useMemo(() => numPrice * numAmount, [numPrice, numAmount])

  const todayStr = new Date().toISOString().split('T')[0]

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: FormErrors = {}

    if (!form.token) {
      errs.token = 'Select a token'
    }
    if (!form.price || numPrice <= 0) {
      errs.price = 'Enter a valid price greater than 0'
    } else if (!/^\d+(\.\d{1,4})?$/.test(form.price)) {
      errs.price = 'Max 4 decimal places'
    }
    if (!form.amount || numAmount <= 0) {
      errs.amount = 'Enter a valid amount greater than 0'
    }
    if (!form.expiry) {
      errs.expiry = 'Expiry date is required'
    } else if (form.expiry <= todayStr) {
      errs.expiry = 'Expiry must be a future date'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCreate = () => {
    if (!validate()) return
    setPreviewOpen(true)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))

    if (Math.random() < 0.1) {
      setSubmitting(false)
      showToast({ message: 'Failed to create listing. Please try again.', type: 'error' })
      return
    }

    setSubmitting(false)
    setPreviewOpen(false)
    showToast({ message: 'Listing created successfully!', type: 'success' })
    navigate('/market')
  }

  return (
    <div className="py-8">
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-28 font-bold text-text-primary">Create Listing</h1>
            <p className="text-14 text-text-secondary mt-1">
              List tokens for OTC trading. All trades are peer-to-peer.
            </p>
          </div>

          <div className="space-y-6">
            {/* ── Token ── */}
            <div className="bg-bg-surface border border-border-default rounded-xl p-5">
              <h2 className="text-14 font-semibold text-text-primary mb-4">Token Details</h2>

              <div className="space-y-4">
                <TokenSelect
                  value={form.token}
                  onChange={v => { set('token')(v); clearError('token') }}
                  error={errors.token}
                />

                {/* Buy / Sell toggle */}
                <div>
                  <label className="text-13 font-medium text-text-secondary mb-1.5 block">
                    Order Type
                  </label>
                  <div className="flex gap-3">
                    {(['buy', 'sell'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set('type')(t)}
                        className={clsx(
                          'flex-1 py-3 rounded-xl text-14 font-semibold transition-all border',
                          form.type === t
                            ? t === 'buy'
                              ? 'bg-buy/15 text-buy border-buy/40'
                              : 'bg-sell/15 text-sell border-sell/40'
                            : 'bg-bg-base text-text-muted border-border-default hover:border-neutral-600',
                        )}
                      >
                        {t === 'buy' ? '↑ Buy Order' : '↓ Sell Order'}
                      </button>
                    ))}
                  </div>
                  <p className="text-12 text-text-muted mt-2">
                    {form.type === 'buy'
                      ? 'You want to buy tokens — sellers will fill your order.'
                      : 'You want to sell tokens — buyers will fill your order.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Pricing ── */}
            <div className="bg-bg-surface border border-border-default rounded-xl p-5">
              <h2 className="text-14 font-semibold text-text-primary mb-4">Pricing</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price per unit"
                  type="number"
                  value={form.price}
                  onChange={v => { set('price')(v); clearError('price') }}
                  placeholder="0.00"
                  suffix="USDC"
                  error={errors.price}
                  hint="Price in USDC for one unit"
                  step="0.0001"
                  min={0}
                />
                <Input
                  label={`Amount${form.token ? ` (${form.token})` : ''}`}
                  type="number"
                  value={form.amount}
                  onChange={v => { set('amount')(v); clearError('amount') }}
                  placeholder="0"
                  suffix={form.token || 'Token'}
                  error={errors.amount}
                  hint="Total quantity to list"
                  min={0}
                />
              </div>

              {/* Total (readonly) */}
              <div className="mt-4">
                <Input
                  label="Total Value"
                  type="number"
                  value={total > 0 ? total.toFixed(4) : ''}
                  onChange={() => {}}
                  placeholder="0.00"
                  suffix="USDC"
                  readOnly
                  hint="Auto-calculated: price × amount"
                />
              </div>

              {/* Min fill — optional */}
              <div className="mt-4">
                <Input
                  label={`Min fill amount${form.token ? ` (${form.token})` : ''} — optional`}
                  type="number"
                  value={form.minFill}
                  onChange={set('minFill')}
                  placeholder="Leave blank for any size"
                  suffix={form.token || 'Token'}
                  hint="Reject partial fills below this quantity"
                  min={0}
                />
              </div>
            </div>

            {/* ── Expiry & Notes ── */}
            <div className="bg-bg-surface border border-border-default rounded-xl p-5">
              <h2 className="text-14 font-semibold text-text-primary mb-4">Details</h2>

              <div className="space-y-4">
                <Input
                  label="Expiry date"
                  type="date"
                  value={form.expiry}
                  onChange={v => { set('expiry')(v); clearError('expiry') }}
                  error={errors.expiry}
                  hint="Listing automatically closes on this date"
                  min={new Date(Date.now() + 86400_000).toISOString().split('T')[0]}
                />

                {/* Notes textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-13 font-medium text-text-secondary">
                    Notes — optional
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes')(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Add context about this listing (optional)…"
                    className={clsx(
                      'w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2.5',
                      'text-14 text-text-primary placeholder:text-text-muted resize-none',
                      'focus:outline-none focus:border-border-active transition-colors',
                    )}
                  />
                  <p className="text-12 text-text-muted text-right">{form.notes.length}/500</p>
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => navigate('/market')}
              >
                Cancel
              </Button>
              <Button
                variant={form.type === 'buy' ? 'buy' : 'sell'}
                size="lg"
                fullWidth
                onClick={handleCreate}
              >
                {form.type === 'buy' ? 'Create Buy Listing' : 'Create Sell Listing'}
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>

      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleConfirm}
        loading={submitting}
        form={form}
        total={total}
      />
    </div>
  )
}
