import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import { LocalForage } from 'bloben-package/utils/LocalForage';
import { logger } from '../../bloben-common/utils/common';
import WebsocketHandler from '../../utils/websocket';

/**
 * Connect to websocket server
 */

// STOMP WEBSOCKETS
let socket;
export let stompClient: any;

interface StorageProviderProps {
  children: any;
}

const WebsocketProvider = (props: StorageProviderProps) => {
  LocalForage.config();

  const closeWebsockets = (): void => {
    if (stompClient) {
      stompClient.disconnect();
    }
    logger('DISCONNECT WS');
  };

  /**
   * Init websocket connection
   */
  const connectToWs = (): void => {
    // Clear stompClient after lost connection
    socket = null;
    stompClient = null;

    // Need to create new instance on each reconnect with server
    socket = new SockJS(`${process.env.REACT_APP_API_URL as string}/ws`);
    stompClient = Stomp.over(socket);

    // Handle connection loss
    stompClient.debug = (frame: any): void => {
      if (frame.indexOf('Connection closed') !== -1) {
        setTimeout(connectToWs, 7000);
      }
    };

    // Init connection
    stompClient.connect(
      'user',
      'password',
      () => {
        setTimeout(() => {
          stompClient.subscribe('/user/notifications', (message: any) => {
            WebsocketHandler.handleCreateNotification(message.body);
          });
        }, 20);

        // Receive automatic updates from server
        stompClient.subscribe('/user/sync', (message: any) => {
          WebsocketHandler.handleSyncGeneral(message);
        });
        stompClient.send(
          '/app/notifications',
          {},
          JSON.stringify({ name: 'username' })
        );
      },
      (e: any) => {
        connectToWs();
        console.log('ERROR ', e);
      }
    );
  };

  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(
    () => (): void => {
      closeWebsockets();

      return;
    },
    []
  );

  return <>{props.children}</>;
};

export default WebsocketProvider;
