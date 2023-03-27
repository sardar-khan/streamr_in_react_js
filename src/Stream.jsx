import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { StreamrClient } from "streamr-client";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Stream() {
  const { isDisconnected, address } = useAccount();
  const navigate = useNavigate();
  const [pathname, setPathname] = useState("");
  const [allSubscriptions, setAllSubscriptions] = useState("");
  const [subsStreamId, setSubsStreamId] = useState("");
  const [unsubscribeStreamId, setUnsubscribeStreamId] = useState("");
  const [message, setMessage] = useState({
    subject: "",
    message: "",
  });

  const streamId = "0xe5ac5a490aa8efeaf0e3ddcb494eb8c513016430/first-stream";

  // const streamr = new StreamrClient({
  //   auth: {
  //     ethereum: window.ethereum,
  //   },
  // });

  const streamr = new StreamrClient({
    auth: {
      privateKey:
        "PUT_YOUR_PRIVATE_KEY_HERE_or_OR_UNCOMMENT_ABOVE_CODE_TO_USE_YOUR_WALLET_ADDRESS",
    },
  });

  console.log("Streamr:", streamr);
  // Get All Subscribers ----------------------------------------------------------------
  const getAllSubscriptions = () => {
    streamr.getSubscriptions().then((subs) => {
      console.log("Getting Subscriptions...");
      setAllSubscriptions(subs);
      console.log("All Subscription:", subs);
    });
  };

  // Subscribe to Stream ----------------------------------------------------------------
  const subscribeToStream = () => {
    streamr
      .subscribe(subsStreamId, (content, metadata) => {
        console.log("Subscribe to Stream:");
        console.log("Content:", content);
        console.log("Metadata:", metadata);
      })
      .then((responce) => {
        console.log("Subscribe to Stream Responce:", responce);
        toast.success(
          "Subscribe to: " +
            responce.streamPartId.slice(0, 7) +
            " ... " +
            responce.streamPartId.slice(-10)
        );
      })
      .catch((err) => {
        console.log("Subscribe to Stream Error:", err);
        toast.error(err.message);
      });
  };

  // UnSubscribe to Stream ----------------------------------------------------------------
  const unsubscribeToStream = () => {
    streamr
      .subscribe(unsubscribeStreamId)
      .then((responce) => {
        console.log("UnSubscribe to Stream Responce:", responce);
        toast.success(
          "UnSubscribe to: " +
            responce.streamPartId.slice(0, 7) +
            " ... " +
            responce.streamPartId.slice(-10)
        );
      })
      .catch((err) => {
        console.log("UnSubscribe to Stream Error:", err);
        toast.error(err.message);
      });
  };

  // Create a Stream ----------------------------------------------------------------------
  const createStream = () => {
    streamr
      .createStream({
        id: "/" + pathname,
      })
      .then((stream) => console.log("Stream ID:", stream.id))
      .catch((err) => {
        console.log("Creating Stream Error:", err);
        toast.error(err.message);
      });
  };
  // Send Message to Stream ---------------------------------------------------------------

  const sendSpecificMessage = () => {
    console.log("Please Wait: Message is been sending...");
    streamr
      .publish("0xe5ac5a490aa8efeaf0e3ddcb494eb8c513016430/first-stream", {
        name: message?.subject,
        message: message?.message,
        date: new Date(),
      })
      .then((_res) => {
        console.log("Publish Message Responce:", _res);
      })
      .catch((_err) => {
        console.log("Publish Error:", _err);
      });
  };

  const sendMessage = () => {
    console.log("Please Wait: Message is been sending...");
    streamr
      .publish("0xe5ac5a490aa8efeaf0e3ddcb494eb8c513016430/first-stream", {
        name: "React Js",
        message: "Hey there, you're just a machine.",
        date: new Date(),
      })
      .then((_res) => {
        console.log("Publish Message Responce:", _res);
      })
      .catch((_err) => {
        console.log("Publish Error:", _err);
      });
  };

  const fetchLastMessages = async () => {
    const resend1 = await streamr.resend(
      streamId,
      {
        last: 20,
      },
      (messages) => {
        console.log("FM Responce:", messages);
      }
    );
    console.log("Fetched Messages Final Responce:", resend1);
  };

  useEffect(() => {
    // if (!isDisconnected) navigate("/", { replace: true });
    getAllSubscriptions();
  }, [isDisconnected]);

  return (
    <div className="h-screen relative bg-gradient-to-br from-gradiant-start via-gradiant-end to-gradiant-end">
      <Toaster />
      <div className="flex justify-between items-center mx-16 py-6">
        <h2
          // onClick={() => navigate("/")}
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold cursor-pointer"
        >
          {"< Back"}
        </h2>
        <ConnectButton />
      </div>
      <h2
        className="px-16 underline cursor-pointer text-blue-900 mb-2"
        onClick={sendMessage}
      >
        Click{" >"} Send Message - Inspect to View Changes
      </h2>
      <h2
        className="px-16 underline cursor-pointer text-blue-900 mb-10"
        onClick={fetchLastMessages}
      >
        Click{" >"} Fetch Last 20 Messages - Inspect to View Changes
      </h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 mx-16">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-4"
          for="grid-city"
        >
          All stream required a unique path in the format{" "}
          <strong>domain/pathname</strong>. Your default domain will be Eth
          Address.
        </label>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-city"
            >
              Domain
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              id="grid-city"
              type="text"
              value={address?.slice(0, 8) + " ... " + address?.slice(-5)}
              disabled={true}
              placeholder="Albuquerque"
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-city"
            >
              Pathname
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              id="grid-city"
              type="text"
              placeholder="Albarta"
              onChange={(e) => setPathname(e.target.value)}
            />
          </div>
          <div className="md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-zip"
            >
              Let's Go...
            </label>

            <button
              className={`appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 ${
                pathname ? " bg-button" : "bg-button_light"
              }`}
              disabled={pathname === "" ? true : false}
              onClick={createStream}
            >
              Create Štream
            </button>
          </div>
        </div>
      </div>
      {/* Subscribe to Stream: -------------------------------------------------------------------------------- */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 mx-16">
        {/* Subscribe */}
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-2/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-city"
            >
              Streamr Id
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              id="grid-city"
              type="text"
              placeholder="Subject of Message"
              onChange={(e) => setSubsStreamId(e.target.value)}
            />
          </div>
          <div className="md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-zip"
            >
              Subscribed to Stream
            </label>

            <button
              className={`appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 ${
                subsStreamId ? " bg-button" : "bg-button_light"
              }`}
              disabled={!subsStreamId ? true : false}
              onClick={subscribeToStream}
            >
              Subscribe
            </button>
          </div>
        </div>
        {/* Unsubscribe */}
        <div className="-mx-3 md:flex mb-2 mt-2">
          <div className="md:w-2/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-city"
            >
              Streamr Id
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              id="grid-city"
              type="text"
              placeholder="Subject of Message"
              onChange={(e) => setUnsubscribeStreamId(e.target.value)}
            />
          </div>
          <div className="md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-zip"
            >
              UnSubscribed to Stream
            </label>

            <button
              className={`appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 ${
                unsubscribeStreamId ? " bg-button" : "bg-button_light"
              }`}
              disabled={!unsubscribeStreamId ? true : false}
              onClick={unsubscribeToStream}
            >
              UnSubscribe
            </button>
          </div>
        </div>
      </div>
      {/* Current Stream: -------------------------------------------------------------------------------- */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 mx-16">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-4"
          for="grid-city"
        >
          Current Stream: <strong>{streamId}</strong>
        </label>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-city"
            >
              Subject
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              id="grid-city"
              type="text"
              placeholder="Subject of Message"
              onChange={(e) =>
                setMessage({ ...message, subject: e.target.value })
              }
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-city"
            >
              Message
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              id="grid-city"
              type="text"
              placeholder="Your Message"
              onChange={(e) =>
                setMessage({ ...message, message: e.target.value })
              }
            />
          </div>
          <div className="md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="grid-zip"
            >
              BroadCast your Message
            </label>

            <button
              className={`appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 ${
                message.subject && message.message
                  ? " bg-button"
                  : "bg-button_light"
              }`}
              disabled={!message.subject && !message.message ? true : false}
              onClick={sendSpecificMessage}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stream;
