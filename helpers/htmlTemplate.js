export const htmlTemp = `
<div style="width: 100%; max-width: 600px; margin: 0 auto;">
    <div>
        <h1>New message from %FULLNAME%!</h1>
    </div>
    <div style="height: 1px; width: 100%; background-color: #C0C0C0;"></div>
    <div>
        <p>%MESSAGE%</p>
    </div>
    <div style="height: 1px; width: 100%; background-color: #C0C0C0;"></div>
    <div>
        <h3>Contact information:</h3>
        <ul style="list-style: none; padding: 0;">
            <li>
                <strong>Name:</strong> %FULLNAME%
            </li>
            <li>
                <strong>Email:</strong> %EMAIL%
            </li>
            <li>
                <strong>Phone:</strong> %PHONE%
            </li>
        </ul>
    </div>
</div>
`;