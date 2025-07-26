import {type MetaFunction} from 'react-router';

export const meta: MetaFunction = () => {
  return [
    {title: 'Privacy Policy | LOGO'},
    {
      name: 'description',
      content:
        'Our privacy policy explains how we collect, use, and protect your personal information.',
    },
  ];
};

export default function PrivacyPolicy() {
  return (
    <div className="font-mono">
      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mt-2">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}

      <div className="container w-full flex justify-center">
        <div className="bg-black text-white">
          asdasdasd
          {/* <p className="text-gray-700 leading-relaxed mb-4">
            At LOGO, we respect your privacy and are committed to protecting
            your personal data. This privacy policy explains how we collect,
            use, and safeguard your information when you visit our website or
            make a purchase.
          </p> */}
        </div>
      </div>
    </div>
  );
}
