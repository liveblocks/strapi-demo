"use client";

import { useCallback, useState } from "react";
import sanitizeHtml from "sanitize-html";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import {
  useBroadcastEvent,
  useEventListener,
  useOthers,
  useUpdateMyPresence,
} from "@/liveblocks.config";

import styles from "./EditableTextClient.module.css";
import { shallow } from "@liveblocks/core";

type Props = {
  strapiApiId: string;
  attribute: string;
  initial: string;
  onUpdate: (text: string) => Promise<boolean>;
  onRevalidate: () => Promise<string>;
};

export function EditableTextClient({
  strapiApiId,
  attribute,
  initial,
  onUpdate,
  onRevalidate,
}: Props) {
  const broadcast = useBroadcastEvent();
  const [text, setText] = useState(initial);

  // Sanitize
  const onContentChange = useCallback((e: ContentEditableEvent) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };

    setText(sanitizeHtml(e.currentTarget.innerHTML, sanitizeConf));
  }, []);

  // On save, send data to server component above
  const updateAttribute = useCallback(async () => {
    const result = await onUpdate(text);
    if (!result) {
      return;
    }

    // After save, broadcast update event to other Liveblocks users
    broadcast({
      type: "editableTextUpdate",
      strapiApiId,
      attribute,
      newText: text,
    });
  }, [broadcast, strapiApiId, attribute, text, onUpdate]);

  // Listen for update events for this EditableText component
  useEventListener(async ({ event }) => {
    if (event.type !== "editableTextUpdate") {
      return;
    }

    if (event.strapiApiId === strapiApiId && event.attribute === attribute) {
      // Set text immediately from event to save 1 second
      // setText(event.newText);

      // Update text from Strapi just to be sure
      const newText = await onRevalidate();
      setText(newText);
    }
  });

  const [focused, setFocused] = useState(false);
  const updateMyPresence = useUpdateMyPresence();

  // Show button on focus and tell others you're updating it
  const handleFocus = useCallback(() => {
    setFocused(true);
    updateMyPresence({ editingText: `${strapiApiId}/${attribute}` });
  }, [updateMyPresence, strapiApiId, attribute]);

  // On blur, hide button and reset your presence
  const handleBlur = useCallback(() => {
    setFocused(false);
    updateMyPresence({ editingText: null });
  }, [updateMyPresence]);

  // Find other users that are currently editing this
  const others = useOthers(
    (others) =>
      others.filter(
        (other) => other.presence.editingText === `${strapiApiId}/${attribute}`
      ),
    shallow
  );

  return (
    <span
      className={styles.EditableTextClient}
      data-strapi-editable={`${strapiApiId}/${attribute}`}
    >
      <ContentEditable
        onChange={onContentChange}
        html={text}
        data-editable
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          outline: others.length
            ? `2px solid ${others[0].info.color}`
            : undefined,
        }}
      />
      {focused ? <button onClick={updateAttribute}>Save</button> : null}
    </span>
  );
}
