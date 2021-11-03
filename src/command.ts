#!/usr/bin/env -S deno run

import { Command } from "https://deno.land/x/cliffy@v0.20.0/command/mod.ts";
import "https://deno.land/x/dotenv@v3.0.0/load.ts";
import { Attachment, Comment, ZdTicket } from "./zdTicket.ts";
import { basename } from "https://deno.land/std@0.113.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.113.0/fs/mod.ts";
import { download } from "https://deno.land/x/download/mod.ts";

// 1. ensure zd directory exists
// 2. get list of urls to attachments
// 3. download them all

async function fetchTicket(
  tick: number,
  zUser: string,
  zApiKey: string,
): Promise<ZdTicket> {
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

function fetchAtttachment(ticket: ZdTicket) {
  const comments = ticket.comments;
  const attachments = comments.filter((attachment) => attachment.attachments);

  console.log(attachments);
  return attachments;
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
    ).then((ticket) => {
      fetchAtttachment(ticket);
    });
  })
  .parse(Deno.args);
