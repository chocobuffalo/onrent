import Image from "next/image";

export default function CarUserProvider({}) {
    return(
        <div className="provider">
            <div className="flex items-center space-x-2">
                        <Image src="/profile-placeholder.svg" alt="User" width={24} height={24} />
                        <span className="font-medium text-sm">Nameuser Nameuser</span>
                        <span className="text-blue-500">✔</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400 text-lg">★</span>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                      </div>
        </div>
    )
}