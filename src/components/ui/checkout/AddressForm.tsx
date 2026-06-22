"use client";

import { useState, FormEvent } from "react";
import { ShippingAddress } from "@/store/useUniverseStore";
import { BD_DISTRICTS } from "@/lib/bdDistricts";

interface AddressFormProps {
  initialValue: ShippingAddress | null;
  onSubmit: (address: ShippingAddress) => void;
}

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: "",
  phone: "",
  district: "",
  area: "",
  fullAddress: "",
  notes: "",
};

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white/[0.03] px-4 py-3 font-body text-sm text-bone placeholder:text-smoke/40 focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-ember/60 focus:ring-ember/40"
      : "border-white/10 focus:border-white/25 focus:ring-white/10"
  }`;
}

/**
 * Phase 9: Address Form।
 * বাংলাদেশের ৬৪ জেলার dropdown, ফোন নাম্বার validation (BD format: 01XXXXXXXXX),
 * এবং বাকি প্রয়োজনীয় shipping তথ্য। Submit করার আগে client-side validation,
 * কোনো backend নেই এখনো (Phase 9 শুধু UI flow + local state)।
 */
export default function AddressForm({ initialValue, onSubmit }: AddressFormProps) {
  const [form, setForm] = useState<ShippingAddress>(initialValue ?? EMPTY_ADDRESS);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const update = (field: keyof ShippingAddress, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!form.fullName.trim()) next.fullName = "নাম লিখুন";
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim()))
      next.phone = "সঠিক ফোন নাম্বার দিন (যেমন 01712345678)";
    if (!form.district) next.district = "জেলা নির্বাচন করুন";
    if (!form.area.trim()) next.area = "এলাকার নাম লিখুন";
    if (!form.fullAddress.trim() || form.fullAddress.trim().length < 8)
      next.fullAddress = "বিস্তারিত ঠিকানা লিখুন";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            পূর্ণ নাম
          </label>
          <input
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            type="text"
            placeholder="আপনার নাম"
            className={inputClass(!!errors.fullName)}
          />
          {errors.fullName && (
            <p className="font-mono text-[10px] text-ember">{errors.fullName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            ফোন নাম্বার
          </label>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            type="tel"
            inputMode="numeric"
            placeholder="01XXXXXXXXX"
            className={inputClass(!!errors.phone)}
          />
          {errors.phone && (
            <p className="font-mono text-[10px] text-ember">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            জেলা
          </label>
          <select
            value={form.district}
            onChange={(e) => update("district", e.target.value)}
            className={`${inputClass(!!errors.district)} appearance-none`}
          >
            <option value="" className="bg-obsidian">
              জেলা নির্বাচন করুন
            </option>
            {BD_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name} className="bg-obsidian">
                {d.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="font-mono text-[10px] text-ember">{errors.district}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            এলাকা / থানা
          </label>
          <input
            value={form.area}
            onChange={(e) => update("area", e.target.value)}
            type="text"
            placeholder="যেমন: মিরপুর, গুলশান"
            className={inputClass(!!errors.area)}
          />
          {errors.area && (
            <p className="font-mono text-[10px] text-ember">{errors.area}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-widest text-smoke">
          বিস্তারিত ঠিকানা
        </label>
        <textarea
          value={form.fullAddress}
          onChange={(e) => update("fullAddress", e.target.value)}
          rows={3}
          placeholder="বাড়ি/রোড/ব্লক নম্বর সহ পূর্ণ ঠিকানা লিখুন"
          className={`${inputClass(!!errors.fullAddress)} resize-none`}
        />
        {errors.fullAddress && (
          <p className="font-mono text-[10px] text-ember">{errors.fullAddress}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-widest text-smoke">
          অর্ডার নোট (ঐচ্ছিক)
        </label>
        <input
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          type="text"
          placeholder="ডেলিভারির জন্য কোনো বিশেষ নির্দেশনা থাকলে লিখুন"
          className={inputClass(false)}
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-ember py-3.5 font-mono text-xs uppercase tracking-widest text-void transition-opacity hover:opacity-90"
      >
        Continue to Payment
      </button>
    </form>
  );
}
