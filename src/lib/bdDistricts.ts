/**
 * বাংলাদেশের ৬৪টি জেলার তালিকা — checkout address form-এর district
 * selector-এ ব্যবহৃত হয়। Division অনুযায়ী group করা আছে যাতে dropdown-এ
 * সহজে খুঁজে পাওয়া যায়।
 */

export interface District {
  name: string;
  division: string;
}

export const BD_DISTRICTS: District[] = [
  // Dhaka Division
  { name: "Dhaka", division: "Dhaka" },
  { name: "Faridpur", division: "Dhaka" },
  { name: "Gazipur", division: "Dhaka" },
  { name: "Gopalganj", division: "Dhaka" },
  { name: "Kishoreganj", division: "Dhaka" },
  { name: "Madaripur", division: "Dhaka" },
  { name: "Manikganj", division: "Dhaka" },
  { name: "Munshiganj", division: "Dhaka" },
  { name: "Narayanganj", division: "Dhaka" },
  { name: "Narsingdi", division: "Dhaka" },
  { name: "Rajbari", division: "Dhaka" },
  { name: "Shariatpur", division: "Dhaka" },
  { name: "Tangail", division: "Dhaka" },

  // Chattogram Division
  { name: "Chattogram", division: "Chattogram" },
  { name: "Cox's Bazar", division: "Chattogram" },
  { name: "Bandarban", division: "Chattogram" },
  { name: "Brahmanbaria", division: "Chattogram" },
  { name: "Chandpur", division: "Chattogram" },
  { name: "Cumilla", division: "Chattogram" },
  { name: "Feni", division: "Chattogram" },
  { name: "Khagrachhari", division: "Chattogram" },
  { name: "Lakshmipur", division: "Chattogram" },
  { name: "Noakhali", division: "Chattogram" },
  { name: "Rangamati", division: "Chattogram" },

  // Rajshahi Division
  { name: "Rajshahi", division: "Rajshahi" },
  { name: "Bogura", division: "Rajshahi" },
  { name: "Joypurhat", division: "Rajshahi" },
  { name: "Naogaon", division: "Rajshahi" },
  { name: "Natore", division: "Rajshahi" },
  { name: "Chapainawabganj", division: "Rajshahi" },
  { name: "Pabna", division: "Rajshahi" },
  { name: "Sirajganj", division: "Rajshahi" },

  // Khulna Division
  { name: "Khulna", division: "Khulna" },
  { name: "Bagerhat", division: "Khulna" },
  { name: "Chuadanga", division: "Khulna" },
  { name: "Jashore", division: "Khulna" },
  { name: "Jhenaidah", division: "Khulna" },
  { name: "Kushtia", division: "Khulna" },
  { name: "Magura", division: "Khulna" },
  { name: "Meherpur", division: "Khulna" },
  { name: "Narail", division: "Khulna" },
  { name: "Satkhira", division: "Khulna" },

  // Barishal Division
  { name: "Barishal", division: "Barishal" },
  { name: "Barguna", division: "Barishal" },
  { name: "Bhola", division: "Barishal" },
  { name: "Jhalokati", division: "Barishal" },
  { name: "Patuakhali", division: "Barishal" },
  { name: "Pirojpur", division: "Barishal" },

  // Sylhet Division
  { name: "Sylhet", division: "Sylhet" },
  { name: "Habiganj", division: "Sylhet" },
  { name: "Moulvibazar", division: "Sylhet" },
  { name: "Sunamganj", division: "Sylhet" },

  // Rangpur Division
  { name: "Rangpur", division: "Rangpur" },
  { name: "Dinajpur", division: "Rangpur" },
  { name: "Gaibandha", division: "Rangpur" },
  { name: "Kurigram", division: "Rangpur" },
  { name: "Lalmonirhat", division: "Rangpur" },
  { name: "Nilphamari", division: "Rangpur" },
  { name: "Panchagarh", division: "Rangpur" },
  { name: "Thakurgaon", division: "Rangpur" },

  // Mymensingh Division
  { name: "Mymensingh", division: "Mymensingh" },
  { name: "Jamalpur", division: "Mymensingh" },
  { name: "Netrokona", division: "Mymensingh" },
  { name: "Sherpur", division: "Mymensingh" },
];
