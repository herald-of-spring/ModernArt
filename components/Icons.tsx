
import React from 'react';
import { AuctionType } from '../types';

export const GavelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.54 2.13L13.13 3.54L15.59 6L14.17 7.41L11.71 5L2.64 14.07L4.05 15.48L5.46 14.07L6.88 15.5L16.29 6.09L17.71 7.5L18.41 6.79L21.95 3.25L14.54 2.13M4.05 18.3L8.26 14.08L9.68 15.5L5.46 19.71L4.05 18.3Z" />
    </svg>
);

export const MoneyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.8,10.9c-2.27-0.59-3-1.2-3-2.15c0-1.09,1.01-1.85,2.7-1.85c1.78,0,2.44,0.85,2.5,2.1h2.21c-0.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94,0.42-3.5,1.68-3.5,3.61c0,2.31,1.91,3.46,4.7,4.13c2.5,0.6,3,1.48,3,2.41c0,0.69-0.49,1.79-2.7,1.79c-2.06,0-2.87-0.92-2.98-2.1h-2.2c0.12,2.19,1.76,3.42,3.68,3.83V21h3v-2.15c2.14-0.45,3.5-1.74,3.5-3.7c0-2.71-2.29-3.99-5.02-4.66z" />
    </svg>
);

export const AuctionTypeIcon: React.FC<{ type: AuctionType, className?: string }> = ({ type, className }) => {
    switch(type) {
        case AuctionType.OPEN:
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>;
        case AuctionType.ONE_OFFER:
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>;
        case AuctionType.HIDDEN:
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" /></svg>;
        case AuctionType.FIXED_PRICE:
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c2.14-.45 3.5-1.74 3.5-3.7c0-2.71-2.29-3.99-5.02-4.66z" /></svg>;
        case AuctionType.DOUBLE:
            return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 9.05L12.95 10l-0.95 2.05L14.05 13l-1.1 2.45L15.4 16l-1.3 2.85 3.6-1.6L19 12.25l-1.3-2.85L15.4 8l-2.45-1.1L12 9.05M8.6 16l1.3 2.85-3.6-1.6L5 12.25l1.3-2.85L8.6 8l2.45-1.1L12 9.05 11.05 10l0.95 2.05L10 13l1.1 2.45L8.6 16Z" /></svg>;
    }
};
