export interface ZdTicket {
    comments:      Comment[];
    next_page:     null;
    previous_page: null;
    count:         number;
}

export interface Comment {
    id:          number;
    type:        Type;
    author_id:   number;
    body:        string;
    html_body:   string;
    plain_body:  string;
    public:      boolean;
    attachments: Attachment[];
    audit_id:    number;
    via:         Via;
    created_at:  Date;
    metadata:    Metadata;
}

export interface Attachment {
    url:                string;
    id:                 number;
    file_name:          string;
    content_url:        string;
    mapped_content_url: string;
    content_type:       string;
    size:               number;
    width:              null;
    height:             null;
    inline:             boolean;
    deleted:            boolean;
    thumbnails:         any[];
}

export interface Metadata {
    system:              System;
    custom:              Custom;
    suspension_type_id?: null;
}

export interface Custom {
}

export interface System {
    client?:                string;
    ip_address:             string;
    location:               string;
    latitude:               number;
    longitude:              number;
    message_id?:            string;
    raw_email_identifier?:  string;
    json_email_identifier?: string;
}

export enum Type {
    Comment = "Comment",
}

export interface Via {
    channel: Channel;
    source:  Source;
}

export enum Channel {
    API = "api",
    Email = "email",
    Web = "web",
}

export interface Source {
    from: From;
    to:   To;
    rel:  null;
}

export interface From {
    address?:             string;
    name?:                string;
    original_recipients?: string[];
}

export interface To {
    name?:    string;
    address?: string;
}
