"use client";

import { useState, useEffect } from "react";
import { GetQuoteModal } from "./GetQuoteModal";

export function GetQuoteProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<string | undefined>();

  useEffect(() => {
    // Set up the global callback for opening the Get Quote modal
    if (typeof window !== "undefined") {
      window.__lc_open_get_quote_modal = (source?: string) => {
        setModalSource(source);
        setIsModalOpen(true);
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.__lc_open_get_quote_modal;
      }
    };
  }, []);

  return (
    <GetQuoteModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      source={modalSource}
    />
  );
}

