import React from 'react';

interface CanadaFlagProps {
  className?: string;
}
const CanadaFlag: React.FC<CanadaFlagProps> = ({ className = '' }) => {
  return (
      <svg
        className="w-8 h-auto border-2 rounded bg-background hover:bg-accent hover:text-accent-foreground"
        viewBox="0 0 9600 4800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#f00"
          d="M0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"
        />
        <path
          fill="#fff"
          d="M2400 0h4800v4800h-4800zM4890 4430l-45-863a95 95 0 01111-98l859 151-116-320a65 65 0 0120-73l941-762-212-99a65 65 0 01-34-79l186-572-542 115a65 65 0 01-73-38l-105-247-423 454a65 65 0 01-111-57l204-1052-327 189a65 65 0 01-91-27l-332-652-332 652a65 65 0 01-91 27l-327-189 204 1052a65 65 0 01-111 57l-423-454-105 247a65 65 0 01-73 38l-542-115 186 572a65 65 0 01-34 79l-212 99 941 762a65 65 0 0120 73l-116 320 859-151a95 95 0 01111 98l-45 863z"
        />
      </svg>
  );
};

export default CanadaFlag;
