'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface ReferralData {
    referral_link: string;
    qr_image_base64: string;
}

export default function ReferralInfo() {
    const { data: session } = useSession();
    const [referral, setReferral] = useState<ReferralData | null>(null);
    const [copied, setCopied] = useState(false);
    const email = session?.user?.email ?? null;

    useEffect(() => {
        if (!email) return;

        const fetchReferral = async () => {
            try {
                const res = await axios.post<ReferralData>(
                'https://api.onrentx.com/api/generate-referral',
                {
                    email: email,
                    referral_type: 'cliente',
                }
                );
                setReferral(res.data);
            } catch (err) {
                console.error('Error fetching referral info:', err);
            }
        };

        fetchReferral();
    }, [email]);

    return (
        <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                Invita y gana recompensas
            </h2>

            {referral ? (
                <>
                <div className="bg-gray-100 p-3 rounded flex items-center justify-between">
                    <input
                    type="text"
                    readOnly
                    value={referral.referral_link}
                    className="bg-transparent text-sm w-full mr-2 focus:outline-none"
                    />
                    <button
                    onClick={() => {
                        navigator.clipboard.writeText(referral.referral_link);
                        setCopied(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                    >
                    Copiar
                    </button>
                </div>

                {copied && (
                    <p className="text-green-600 text-sm mt-1 text-center">
                    ¡Enlace copiado!
                    </p>
                )}

                {referral.qr_image_base64 && (
                    <div className="mt-6 flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-2">
                        O escanea este código QR:
                    </p>
                    <img
                        src={`data:image/png;base64,${referral.qr_image_base64}`}
                        alt="QR de referido"
                        className="w-32 h-32"
                    />
                    </div>
                )}
                </>
            ) : (
                <p className="text-center text-gray-500">
                Cargando link de referido...
                </p>
            )}
        </div>
    );
}
