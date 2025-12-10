// Simple EventEmitter implementation for browser environment
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Function): void {
    if (!this.events[event]) return;
    const index = this.events[event].indexOf(listener);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

// Real-time service for handling WebSocket/SSE connections
export class RealTimeService extends EventEmitter {
  private ws: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private connectionType: 'websocket' | 'sse' | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private lastHeartbeat: number = 0;

  constructor() {
    super();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.on('connected', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    });

    this.on('disconnected', () => {
      this.isConnected = false;
      this.stopHeartbeat();
      this.attemptReconnect();
    });

    this.on('error', (error: any) => {
      console.error('Real-time service error:', error);
      this.isConnected = false;
    });
  }

  // Connect using WebSocket
  connectWebSocket(url: string): void {
    if (this.ws) {
      this.disconnect();
    }

    try {
      this.connectionType = 'websocket';
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.emit('disconnected');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.emit('error', error);
    }
  }

  // Connect using Server-Sent Events
  connectSSE(url: string): void {
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      this.connectionType = 'sse';
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('SSE connected');
        this.emit('connected');
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        this.emit('error', error);
        this.emit('disconnected');
      };

      // Listen for specific events
      this.eventSource.addEventListener('seat-update', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('seat-update', data);
        } catch (error) {
          console.error('Failed to parse seat-update event:', error);
        }
      });

      this.eventSource.addEventListener('booking-update', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('booking-update', data);
        } catch (error) {
          console.error('Failed to parse booking-update event:', error);
        }
      });

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      this.emit('error', error);
    }
  }

  // Handle incoming messages
  private handleMessage(data: any): void {
    if (data.type === 'heartbeat') {
      this.lastHeartbeat = Date.now();
      return;
    }

    if (data.type === 'seat-update') {
      this.emit('seat-update', data.payload);
    } else if (data.type === 'booking-update') {
      this.emit('booking-update', data.payload);
    } else if (data.type === 'bus-update') {
      this.emit('bus-update', data.payload);
    } else if (data.type === 'lock-expired') {
      this.emit('lock-expired', data.payload);
    } else {
      this.emit('message', data);
    }
  }

  // Start heartbeat monitoring
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.connectionType === 'websocket' && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }

      // Check if heartbeat is stale (more than 30 seconds old)
      if (this.lastHeartbeat > 0 && Date.now() - this.lastHeartbeat > 30000) {
        console.warn('Heartbeat stale, reconnecting...');
        this.emit('disconnected');
      }
    }, 10000); // Check every 10 seconds
  }

  // Stop heartbeat monitoring
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Attempt to reconnect
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect-failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    setTimeout(() => {
      if (this.connectionType === 'websocket') {
        this.connectWebSocket(this.getCurrentUrl());
      } else if (this.connectionType === 'sse') {
        this.connectSSE(this.getCurrentUrl());
      }
    }, delay);
  }

  // Get current connection URL
  private getCurrentUrl(): string {
    if (this.connectionType === 'websocket' && this.ws) {
      return this.ws.url;
    } else if (this.connectionType === 'sse' && this.eventSource) {
      return this.eventSource.url;
    }
    return '';
  }

  // Subscribe to seat updates for a specific bus
  subscribeToBus(busId: string): void {
    if (this.connectionType === 'websocket' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        channel: `bus:${busId}`,
      }));
    }
  }

  // Unsubscribe from seat updates for a specific bus
  unsubscribeFromBus(busId: string): void {
    if (this.connectionType === 'websocket' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        channel: `bus:${busId}`,
      }));
    }
  }

  // Subscribe to booking updates
  subscribeToBooking(bookingId: string): void {
    if (this.connectionType === 'websocket' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        channel: `booking:${bookingId}`,
      }));
    }
  }

  // Unsubscribe from booking updates
  unsubscribeFromBooking(bookingId: string): void {
    if (this.connectionType === 'websocket' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        channel: `booking:${bookingId}`,
      }));
    }
  }

  // Send a message (WebSocket only)
  sendMessage(data: any): void {
    if (this.connectionType === 'websocket' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  // Disconnect from real-time service
  disconnect(): void {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.isConnected = false;
    this.connectionType = null;
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get connection type
  getConnectionType(): 'websocket' | 'sse' | null {
    return this.connectionType;
  }
}

// Create singleton instance
export const realTimeService = new RealTimeService();

// Types for real-time events
export interface SeatUpdateEvent {
  busId: string;
  seatId: string;
  status: 'Available' | 'Booked' | 'Locked';
  lockedBy?: string;
  lockedUntil?: string;
}

export interface BookingUpdateEvent {
  bookingId: string;
  status: 'PaymentPending' | 'Confirmed' | 'Cancelled' | 'Expired';
  paymentStatus: 'Pending' | 'Success' | 'Failed' | 'Refunded';
}

export interface BusUpdateEvent {
  busId: string;
  availableSeats: number;
  totalSeats: number;
  lastUpdated: string;
}

export interface LockExpiredEvent {
  lockId: string;
  seatIds: string[];
  busId: string;
}