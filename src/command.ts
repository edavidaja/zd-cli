#!/usr/bin/env -S deno run

import { Command } from "https://deno.land/x/cliffy@v0.20.0/command/mod.ts";
import "https://deno.land/x/dotenv@v3.0.0/load.ts";
import { Attachment, Comment, ZdTicket } from "./zdTicket.ts";
import { ensureDir } from "https://deno.land/std@0.113.0/fs/mod.ts";
import { Destination, download } from "https://deno.land/x/download/mod.ts";
import dir from "https://deno.land/x/dir/mod.ts";

// 1. ensure zd directory exists
// 2. get list of urls to attachments
// 3. download them all
// if they haven't been downloaded already
// 4. put them in ~/downloads/support/ticketid or somewhere by user request

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

function getAttachmentUrls(ticket: ZdTicket): string[] {
  const comments = ticket.comments;
  const attachmentUrls = comments.filter((attachment) =>
    attachment.attachments.length !== 0
  ).flatMap((attachment) => attachment.attachments.map((el) => el.content_url));

  return attachmentUrls;
}

async function downloadAttachments(tick: number, urls: string[]) {
  const downloadDir = dir("download");
  const destDir = `${downloadDir}/support/${tick}`;
  await ensureDir(destDir);
  urls.map(async (url) => {
    const urlParams = (new URL(url)).searchParams;
    const filename = urlParams.get("name")?.toString();
    const destination: Destination = {
      dir: destDir,
      file: filename,
    };

    const _fileObj = await download(url, destination);
  });
}

await new Command()
  .name("zd")
  .version("0.1.2")
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
      const urls = getAttachmentUrls(ticket);
      downloadAttachments(ticketId, urls);
    });
  })
  .parse(Deno.args);
