import downloadbtn from "../../assets/icons/downloadbtn.svg";

interface CartoonProps {
  date: Date;
  image_url: string;
  title: string;
}

export default function Cartoon({ date, image_url, title }: CartoonProps) {
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const downloadFileName = `comic_${formattedDate}.png`;

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(image_url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    }
  };

  return (
    <div className="cartoon-container">
      <div className="cartoon-date">
        {`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}
      </div>

      <div className="cartoon-content">
        <img src={image_url} className="cartoon-img" alt="네컷 만화" />
        <img
          src={downloadbtn}
          className="save-btn"
          alt="다운로드 버튼"
          onClick={handleDownloadImage}
          role="button"
          tabIndex={0}
        />
      </div>

      <div className="cartoon-hashtag">{title && <p>{title}</p>}</div>
    </div>
  );
}
