const baseUrl = "https://teh-1.s3.poshtiban.com/versions/";
        let files = [];

        async function fetchFiles() {
            const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(baseUrl));
            const data = await response.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "application/xml");
            const contents = xml.getElementsByTagName('Contents');

            files = Array.from(contents).map(item => ({
                key: item.getElementsByTagName('Key')[0].textContent,
                lastModified: item.getElementsByTagName('LastModified')[0].textContent,
                size: parseInt(item.getElementsByTagName('Size')[0].textContent)
            }));

            // مرتب‌سازی پیش‌فرض بر اساس جدیدترین تاریخ
            files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

            renderFiles(files);
        }

        function renderFiles(files) {
            const fileList = document.getElementById('file-list');
            fileList.innerHTML = ''; // پاک کردن محتوای قبلی

            files.forEach(file => {
                const fileBlock = document.createElement('div');
                fileBlock.className = 'file-block';

                fileBlock.innerHTML = `
                    <h3>${file.key}</h3>
                    <p>حجم: ${formatSize(file.size)}</p>
                    <p>تاریخ: ${new Date(file.lastModified).toLocaleString('fa-IR')}</p>
                    <a href="${baseUrl + file.key}" class="download-button" download>دانلود</a>
                `;

                fileList.appendChild(fileBlock);
            });
        }

        function formatSize(bytes) {
            const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
            if (bytes === 0) return '0 بایت';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }

        // بارگذاری فایل‌ها پس از بارگذاری صفحه
        window.onload = fetchFiles;