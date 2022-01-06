# zd downloader

download all the attachments from a zendesk ticket to
`~/Downloads/support/<ticket-id>`

## install

- download the release for your os
- place it in `~/.local/bin`

## use

```
❯ zd download --help                         

  Usage:   zd download <ticketId>
  Version: 0.2.2                 

  Description:

    download all attachments for a zendesk ticket

  Options:

    -h, --help  - Show this help.  

  Environment variables:

    CONNECT_API_KEY  <value>  - connect api key for rstudioservices
```
