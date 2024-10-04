export default function Loader(){
    return (
    <div className="flex justify-center items-center h-screen">
      <div className="dot-spinner">
        {[...Array(8)].map((_, index) => (
          <div className="dot-spinner__dot" key={index} />
        ))}
      </div>
    </div>
    )
}