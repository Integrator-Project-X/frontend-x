type ClinicCardProps = {
  name: string;
  address: string;
  phone: string;
  distance: string;
};

const ClinicCard = ({ name, address, phone, distance }: ClinicCardProps) => {
  return (
    <div className="clinic-card">
      <h4>{name}</h4>
      <p>{address}</p>
      <p>Phone: {phone}</p>
      <p>Distance: {distance}</p>
      <button>Call Now</button>
      <button>View on Map</button>
    </div>
  );
};

export default ClinicCard;