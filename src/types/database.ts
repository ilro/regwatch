export type BusinessType =
  | "sole_trader"
  | "partnership"
  | "company"
  | "trust"
  | "cooperative";

export type AUState =
  | "NSW"
  | "VIC"
  | "QLD"
  | "SA"
  | "WA"
  | "TAS"
  | "NT"
  | "ACT";

export type Industry =
  | "retail"
  | "hospitality"
  | "construction"
  | "professional_services"
  | "healthcare"
  | "education"
  | "technology"
  | "agriculture"
  | "manufacturing"
  | "transport"
  | "finance"
  | "real_estate"
  | "other";

export type Category =
  | "taxation"
  | "employment"
  | "safety"
  | "environmental"
  | "consumer"
  | "financial"
  | "licensing"
  | "privacy"
  | "other";

export type ReminderType = "email" | "push";

export type Frequency =
  | "once"
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "quarterly"
  | "annually";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          business_name: string | null;
          business_type: BusinessType | null;
          state: AUState | null;
          industry: Industry | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          business_name?: string | null;
          business_type?: BusinessType | null;
          state?: AUState | null;
          industry?: Industry | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string | null;
          business_type?: BusinessType | null;
          state?: AUState | null;
          industry?: Industry | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      compliance_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          due_date: string;
          frequency: Frequency;
          category: Category;
          is_custom: boolean;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          due_date: string;
          frequency: Frequency;
          category: Category;
          is_custom?: boolean;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string;
          frequency?: Frequency;
          category?: Category;
          is_custom?: boolean;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          item_id: string;
          user_id: string;
          reminder_date: string;
          sent: boolean;
          type: ReminderType;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          user_id: string;
          reminder_date: string;
          sent?: boolean;
          type?: ReminderType;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          user_id?: string;
          reminder_date?: string;
          sent?: boolean;
          type?: ReminderType;
          created_at?: string;
        };
      };
      compliance_rules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: Category;
          frequency: Frequency;
          business_types: BusinessType[];
          states: AUState[];
          industries: Industry[];
          default_due_date: string | null;
          authority: string | null;
          reference_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: Category;
          frequency: Frequency;
          business_types: BusinessType[];
          states?: AUState[];
          industries?: Industry[];
          default_due_date?: string | null;
          authority?: string | null;
          reference_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: Category;
          frequency?: Frequency;
          business_types?: BusinessType[];
          states?: AUState[];
          industries?: Industry[];
          default_due_date?: string | null;
          authority?: string | null;
          reference_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ComplianceItem = Database["public"]["Tables"]["compliance_items"]["Row"];
export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
export type ComplianceRule = Database["public"]["Tables"]["compliance_rules"]["Row"];
