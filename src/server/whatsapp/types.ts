export interface MetaWebhookPayload {
  object: string;
  entry: MetaEntry[];
}

export interface MetaEntry {
  id: string;
  changes: MetaChange[];
}

export interface MetaChange {
  value: MetaChangeValue;
  field: string;
}

export interface MetaChangeValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: MetaContact[];
  messages?: MetaInboundMessage[];
  statuses?: MetaStatus[];
}

export interface MetaContact {
  profile: { name: string };
  wa_id: string;
}

export interface MetaInboundMessage {
  from: string;
  id: string;
  timestamp: string;
  type: "text" | "image" | "audio" | "document" | "video" | "sticker" | "unknown";
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string; caption?: string };
  audio?: { id: string; mime_type: string };
  document?: { id: string; filename: string; mime_type: string; caption?: string };
}

export interface MetaStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  recipient_id: string;
}

export interface MetaSendResponse {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
}
