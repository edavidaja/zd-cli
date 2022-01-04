library(plumber)
library(httr2)

#* @apiTitle zd
#* @apiDescription authenticated calls to the zendesk api

#* attachment urls
#* @param ticket_ids a vector of ticket ids
#* @get /tickets
#*
#* @response a vector of attachment urls
function(ticket_ids = c(integer())) {
  list(character())
}
