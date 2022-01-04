library(plumber)
library(httr2)
library(purrr)

getComments <- function(ticket_ids) {
  tix <- ticket_ids
  base_url <- "https://rstudioide.zendesk.com"

  rlog::log_debug(tix)

  map2(base_url, tix, ~ {
    request(.x) |>
      req_template("GET /api/v2/tickets/{ticket_id}/comments.json", ticket_id = .y) |>
      req_auth_basic(Sys.getenv("ZD_USER"), Sys.getenv("ZD_API_KEY"))
  })
}

requestAttachmentUrls <- function(reqs) {
  rlog::log_debug(reqs)

  reqs |>
    multi_req_perform()
}

parseAttachmentRequest <- function(reqs) {
  res <- keep(reqs, ~ !inherits(.x, what = "error")) |>
    map(resp_body_json)

  rlog::log_debug(res)

  urls <-
    map_depth(res, 3, "attachments") |>
    map(compact) |>
    map_depth(4, "content_url") |>
    rlang::squash_chr()

  rlog::log_debug(urls)
  urls
}

getAttachmentUrls <- compose(
  getComments,
  requestAttachmentUrls,
  parseAttachmentRequest,
  .dir = "forward"
)

#* @apiTitle zd
#* @apiDescription authenticated calls to the zendesk api

#* attachment urls
#* @param ticket_ids a vector of ticket ids
#* @get /tickets
#*
#* @response a vector of attachment urls
getAttachmentUrls
