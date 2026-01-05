"use client";

import { useState, useEffect } from "react";
import { LiveChatModal } from "./LiveChatModal";

export function LiveChatProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<string | undefined>();
  const [modalPage, setModalPage] = useState<string | undefined>();

  useEffect(() => {
    // Set up the global callback for opening the modal
    if (typeof window !== "undefined") {
      window.__lc_open_modal_callback = (source?: string, page?: string) => {
        setModalSource(source);
        setModalPage(page);
        setIsModalOpen(true);
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.__lc_open_modal_callback;
      }
    };
  }, []);

  return (
    <LiveChatModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      source={modalSource}
      page={modalPage}
    />
  );
}

