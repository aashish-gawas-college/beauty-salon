import React from 'react';

export const WhatsAppButton = () => {
  const handleClick = () => {
    window.open(
      'https://wa.me/918310298181',
      '_blank'
    );
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-16 h-16 md:w-18 md:h-18 rounded-full bg-green-500 hover:bg-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
    >
      <svg
        className="w-8 h-8 md:w-10 md:h-10 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12.036 5.339c-3.635 0-6.591 2.956-6.591 6.59 0 1.158.297 2.25.82 3.202l-1.202 4.402 4.503-1.18c.929.508 1.997.777 3.121.777 3.633 0 6.591-2.956 6.591-6.592.001-3.633-2.958-6.591-6.591-6.591-.001 0-.001 0-.001 0-.05 0-.101-.001-.15-.008zm3.794 9.464c-.168.47-.962.897-1.505.971-.433.062-.994.056-1.601-.205-.263-.113-.601-.264-1.027-.461-1.804-.835-2.984-2.654-3.075-2.775-.092-.12-.757-1.006-.757-1.917s.478-1.362.647-1.548c.168-.186.368-.232.49-.232.122 0 .244.001.35.006.112.007.262-.043.41.312.151.36.513 1.252.557 1.342.045.091.075.196.015.317-.061.12-.091.196-.182.302-.091.105-.192.235-.274.315-.091.091-.186.189-.08.37.105.182.469.773 1.006 1.252.691.615 1.273.806 1.454.896.182.091.288.076.394-.045.105-.122.451-.526.572-.706.12-.181.24-.151.406-.091.166.061 1.07.505 1.254.595.182.091.303.136.348.212.045.075.045.436-.123.907z" />
      </svg>
    </button>
  );
};
