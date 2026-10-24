
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iexcfdtiesgqqgckgmmi.supabase.co';
const supabaseAnonKey = 'sb_publishable_ySv_tWAKNWCRWhW5jyltJw_TutEnXmE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
