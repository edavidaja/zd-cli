#!/usr/bin/env -S deno run

import { Command } from "https://deno.land/x/cliffy@v0.20.0/command/mod.ts";
import "https://deno.land/x/dotenv@v3.0.0/load.ts";

async function fetchTicket(tick: number, zUser: string, zApiKey: string) {
  const authHeader = "Basic " + btoa(`${zUser}:${zApiKey}`);

  const zUrl =
    `https://rstudioide.zendesk.com/api/v2/tickets/${tick}/comments.json`;

  const ticket = await fetch(zUrl, {
    method: "GET",
    headers: { "Authorization": authHeader },
  });
  const result = await ticket.json();
  return result;
}

await new Command()
  .name("zd")
  .version("0.1.0")
  .description("zendesk helpers")
  .command(
    "download <ticketId:integer>",
    "download all attachments for a zendesk ticket",
  )
  .env<{ zdUser: string }>(
    "ZD_USER=<value:string>",
    "zendesk user",
    { global: true, required: true },
  )
  .env<{ zdApiKey: string }>(
    "ZD_API_KEY=<value:string>",
    "zendesk api key",
    { global: true, required: true },
  )
  .action((options, ticketId) => {
    fetchTicket(
      ticketId,
      options.zdUser,
      options.zdApiKey,
    );
  })
  .parse(Deno.args);
