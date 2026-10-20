import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { env } from "./env";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": "baretext-api",
  }),
  logRecordProcessors: [
    new BatchLogRecordProcessor({
      exporter: new OTLPLogExporter({
        url: "https://us.i.posthog.com/i/v1/logs",
        headers: {
          Authorization: `Bearer ${env.POSTHOG_PROJECT_TOKEN}`,
        },
      }),
    }),
  ],
});

sdk.start();
