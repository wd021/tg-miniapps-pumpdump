import { openLink } from "@telegram-apps/sdk-react";
import {
  SendTransactionRequest,
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  Avatar,
  Cell,
  List,
  Navigation,
  Placeholder,
  Section,
  Text,
  Title,
} from "@telegram-apps/telegram-ui";
import type { FC } from "react";

import { DisplayData } from "@/components/DisplayData/DisplayData.tsx";
import { Page } from "@/components/Page.tsx";

import "./TONConnectPage.css";

export const TONConnectPage: FC = () => {
  const wallet = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();

  if (!wallet) {
    return (
      <Page>
        <Placeholder
          className="ton-connect-page__placeholder"
          header="TON Connect"
          description={
            <>
              <Text>
                To display the data related to the TON Connect, it is required
                to connect your wallet
              </Text>
              <TonConnectButton className="ton-connect-page__button" />
            </>
          }
        />
      </Page>
    );
  }

  const {
    account: { chain, publicKey, address },
    device: { appName, appVersion, maxProtocolVersion, platform, features },
  } = wallet;

  return (
    <Page>
      <List>
        {"imageUrl" in wallet && (
          <>
            <Section>
              <Cell
                before={
                  <Avatar
                    src={wallet.imageUrl}
                    alt="Provider logo"
                    width={60}
                    height={60}
                  />
                }
                after={<Navigation>About wallet</Navigation>}
                subtitle={wallet.appName}
                onClick={(e) => {
                  e.preventDefault();
                  openLink(wallet.aboutUrl);
                }}
              >
                <Title level="3">{wallet.name}</Title>
              </Cell>
            </Section>
            <TonConnectButton className="ton-connect-page__button-connected" />
          </>
        )}
        <DisplayData
          header="Account"
          rows={[
            { title: "Address", value: address },
            { title: "Chain", value: chain },
            { title: "Public Key", value: publicKey },
          ]}
        />
        <DisplayData
          header="Device"
          rows={[
            { title: "App Name", value: appName },
            { title: "App Version", value: appVersion },
            { title: "Max Protocol Version", value: maxProtocolVersion },
            { title: "Platform", value: platform },
            {
              title: "Features",
              value: features
                .map((f) => (typeof f === "object" ? f.name : undefined))
                .filter((v) => v)
                .join(", "),
            },
          ]}
        />
      </List>
      <button
        onClick={async () => {
          const transaction: SendTransactionRequest = {
            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
            messages: [
              {
                address: "UQAS5RgeZdShqIIjhTtbFiLPask0eHUmbsltA99oybs8KDvm", // message destination in user-friendly format
                amount: "1000000", // Toncoin in nanotons
              },
            ],
          };

          const txResult = await tonConnectUI.sendTransaction(transaction);

          console.log("txResult", txResult);

          const cell = Cell.fromBase64(txResult.boc);
          const buffer = cell.hash();
          const hashHex = buffer.toString("hex");
          console.log("Transaction Hash:", hashHex);
        }}
      >
        Send transaction
      </button>
    </Page>
  );
};