export function shortenAddress(address?: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function shortenHash(hash?: string, chars = 6): string {
  if (!hash) return "";
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
}

export function formatDate(isoDate?: string): string {
  if (!isoDate) return "-";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  } catch {
    return isoDate;
  }
}

export function getScoreStatusText(score: number): {
  text: string;
  colorClass: string;
  barColorClass: string;
} {
  if (score >= 80) {
    return {
      text: "SANGAT BAIK",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      barColorClass: "bg-emerald-500",
    };
  }
  if (score >= 50) {
    return {
      text: "MERAGUKAN",
      colorClass: "text-amber-600 dark:text-amber-400",
      barColorClass: "bg-amber-500",
    };
  }
  return {
    text: "SANGAT BURUK",
    colorClass: "text-[#dc2626] dark:text-rose-400",
    barColorClass: "bg-[#dc2626]",
  };
}

export function getScoreBadge(score: number): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  if (score >= 80) {
    return {
      label: "Terverifikasi Valid",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500 dark:text-emerald-400",
      borderColor: "border-emerald-500/30",
    };
  }
  if (score >= 50) {
    return {
      label: "Perlu Verifikasi Lanjutan",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500 dark:text-amber-400",
      borderColor: "border-amber-500/30",
    };
  }
  return {
    label: "Terindikasi Hoax",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-500 dark:text-rose-400",
    borderColor: "border-rose-500/30",
  };
}
