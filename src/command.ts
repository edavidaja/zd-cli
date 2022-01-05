#!/usr/bin/env -S deno run

import { Command } from "https://deno.land/x/cliffy@v0.20.0/command/mod.ts";
import { ensureDir } from "https://deno.land/std@0.113.0/fs/mod.ts";
import { Destination, download } from "https://deno.land/x/download/mod.ts";
import dir from "https://deno.land/x/dir/mod.ts";

// 1. ensure zd directory exists
// 2. get list of urls to attachments
// 3. download them all
// if they haven't been downloaded already
// 4. put them in ~/downloads/support/ticketid or somewhere by user request

async function fetchTicket(
  { tick, connectApiKey }: { tick: number; connectApiKey: string },
): Promise<string[]> {
  const authHeader = "Key " + connectApiKey;

  // todo: the API can accept multiple tickets in one query
  const ticket = await fetch(
    "https://connect.rstudioservices.com/edavidaja/zd/tickets?" +
      new URLSearchParams({ ticket_ids: tick.toString() }),
    {
      method: "GET",
      headers: { "Authorization": authHeader },
    },
  );
  const result = await ticket.json();
  return result;
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
  .version("0.2.0")
  .description("zendesk helpers")
  .command(
    "download <ticketId:integer>",
    "download all attachments for a zendesk ticket",
  )
  .env<{ connectApiKey: string }>(
    "CONNECT_API_KEY=<value:string>",
    "connect api key for rstudioservices",
    { global: true, required: true },
  )
  .action((options, ticketId) => {
    fetchTicket(
      { tick: ticketId, connectApiKey: options.connectApiKey },
    ).then((urls) => {
      downloadAttachments(ticketId, urls);
    });
  })
  .parse(Deno.args);
