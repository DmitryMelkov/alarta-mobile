/** Состояние ламп */
export interface LampsText {
  mil: string;
  red_stop: string;
  amber_warning: string;
  protect: string;
}

/** Активная DTC ошибка */
export interface ActiveDTC {
  src_address: number;
  spn: number;
  fmi: number;
  first_seen: number;
  last_seen: number;
  last_occurrence_count: number;
  lamps_state: number;
  lamps_blink: number;
  lamps_text: LampsText;
  severity: number;
  text_name?: string;
  text_explanation?: string;
  text_source_description?: string | null;
  text_source_link?: string | null;
  text_source_name?: string | null;
}

/** Базовая информация о машине */
export interface DTCVehicle {
  wln_id: number;
  wln_name: string;
  imei: number;
}

/** Машина с активными DTC ошибками */
export interface DTCVehicleWithActive extends DTCVehicle {
  active_dtc: ActiveDTC[];
}

/** Машина из списка всех машин */
export interface DTCCar extends DTCVehicle {
  last_data_date?: number;
  last_data_date_text?: string;
  car_year_of_manufacture?: number | null;
}
