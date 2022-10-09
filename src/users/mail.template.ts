export const newUserSubject =
  '[CoolMate] THÔNG BÁO KÍCH HOẠT TÀI KHOẢN THÀNH CÔNG';

export const newUserMailTemplate = (
  name: string,
  email: string,
  password: string,
): string => {
  const url = process.env.DOMAIN;
  return `<!doctype html>
  <html lang="en-US">
	 <head>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
		<title>Account info</title>
		<meta name="description" content="Create account infomation.">
		<style type="text/css">
		   a:hover {
		   text-decoration: underline !important;
		   }
		   h1 {
		   color: #1e1e2d;
		   font-weight: 500;
		   margin: 0;
		   font-size: 28px;
		   font-family: 'Rubik', sans-serif;
		   }
		   p {
		   color: #455056;
		   font-size: 15px;
		   line-height: 24px;
		   margin: 0;
		   }
		</style>
	 </head>
	 <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
		<!--100% body table-->
		<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
		   style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
		   <tr>
			  <td>
				 <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
					cellpadding="0" cellspacing="0">
					<tr>
					   <td style="height:80px;">&nbsp;</td>
					</tr>
					<tr>
					   <td style="text-align:center;">
						  <a href="${url}" title="logo" target="_blank">
							 <svg width="169" height="42" viewBox="0 0 169 42" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M56.2155 33.8777V12.5652H64.6061C68.377 12.5652 70.2624 14.0809 70.2624 17.1121V19.3152C70.2624 20.9402 69.4759 22.0913 67.903 22.7684C69.9655 23.2163 70.9968 24.5288 70.9968 26.7059V28.9871C70.9968 32.2475 69.0541 33.8777 65.1686 33.8777H56.2155ZM66.9655 26.8621C66.9655 25.435 66.2207 24.7215 64.7311 24.7215H60.2468V30.5496H64.3718C66.1009 30.5496 66.9655 29.8569 66.9655 28.4715V26.8621ZM66.2311 17.6277C66.2311 16.4715 65.528 15.8934 64.1218 15.8934H60.2468V21.4871H64.0905C65.5176 21.4871 66.2311 20.8257 66.2311 19.5027V17.6277ZM90.3249 27.6434C90.3249 29.5913 89.7363 31.1277 88.5593 32.2527C87.1843 33.5444 85.0853 34.1902 82.2624 34.1902C79.4395 34.1902 77.3457 33.5444 75.9811 32.2527C74.7936 31.1277 74.1999 29.5913 74.1999 27.6434V18.7996C74.1999 16.8517 74.7936 15.3152 75.9811 14.1902C77.3457 12.8986 79.4395 12.2527 82.2624 12.2527C85.0853 12.2527 87.1843 12.8986 88.5593 14.1902C89.7363 15.3152 90.3249 16.8517 90.3249 18.7996V27.6434ZM78.2311 27.409C78.2311 29.5652 79.5749 30.6434 82.2624 30.6434C84.9499 30.6434 86.2936 29.5652 86.2936 27.409V19.034C86.2936 16.8777 84.9499 15.7996 82.2624 15.7996C79.5749 15.7996 78.2311 16.8777 78.2311 19.034V27.409ZM94.653 33.8777V12.5652H107.841V16.1121H98.6843V21.784H107.137V25.3309H98.6843V33.8777H94.653ZM111.372 33.8777V12.5652H124.559V16.1121H115.403V21.784H123.856V25.3309H115.403V33.8777H111.372ZM132.278 33.8777H128.247V12.5652H132.278V33.8777ZM136.762 18.4246C136.762 14.31 139.288 12.2527 144.341 12.2527C146.361 12.2527 148.294 12.4871 150.137 12.9559L149.684 16.4402C147.726 16.0757 145.992 15.8934 144.481 15.8934C142.023 15.8934 140.794 16.9715 140.794 19.1277V27.3152C140.794 29.4715 142.023 30.5496 144.481 30.5496C145.992 30.5496 147.726 30.3673 149.684 30.0027L150.137 33.4871C148.294 33.9559 146.361 34.1902 144.341 34.1902C139.288 34.1902 136.762 32.133 136.762 28.0184V18.4246ZM153.997 12.5652H167.059V16.1121H158.028V21.2684H166.356V24.8152H158.028V30.3309H167.059V33.8777H153.997V12.5652Z" fill="#0FB77A"></path>
								<path d="M31.7857 7.86415V5.76495C31.7857 3.07535 29.5749 0.877747 26.8692 0.877747H15.8814C13.1757 0.877747 10.965 3.07535 10.965 5.76495V7.86415L0.934082 4.78095V11.8657V14.9817V37.9089C0.934082 40.1065 2.71589 41.8777 4.92664 41.8777H19.709L16.9703 38.9913H16.3434H5.19061C5.19061 38.9913 3.60679 39.3193 3.80477 37.5153C3.80477 32.1033 3.87076 29.9713 3.87076 29.9713L1.89098 28.0033L3.67278 26.3961L1.89098 24.5265L3.87076 22.9849L2.08896 20.2297C2.08896 20.2297 17.7292 23.5753 20.8969 37.5481C17.7292 37.5481 17.5643 37.5481 17.5643 37.5481L21.2929 41.8121L25.0214 37.5481C25.0214 37.5481 24.8565 37.5481 21.6888 37.5481C24.8565 23.6081 40.4967 20.2297 40.4967 20.2297L38.7149 22.9849L40.6947 24.5265L38.9129 26.3961L40.6947 28.0033L38.7149 29.9713C38.7149 29.9713 38.7809 32.1033 38.7809 37.5153C38.9789 39.3193 37.3951 38.9913 37.3951 38.9913H26.2423H25.6154L22.9097 41.8449H37.857C40.0678 41.8449 41.8496 40.0737 41.8496 37.8761V14.9489V11.8329V4.78095L31.7857 7.86415ZM15.8814 3.79695H26.8692C27.9911 3.79695 28.882 4.68255 28.882 5.79775V7.89695H13.8687V5.79775C13.8687 4.68255 14.7926 3.79695 15.8814 3.79695ZM5.52058 17.3761L3.83776 8.84815L10.1731 13.3745L5.52058 17.3761ZM37.0651 17.3761L32.3796 13.3745L38.7149 8.84815L37.0651 17.3761Z" fill="#17CA89"></path>
							 </svg>
						  </a>
					   </td>
					</tr>
					<tr>
					   <td style="height:20px;">&nbsp;</td>
					</tr>
					<tr>
					   <td>
						  <table width="100%" border="0" cellpadding="0" cellspacing="0"
							 style="max-width:670px;background:#fff; border-radius:3px;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
							 <tr>
								<td style="height:40px;">&nbsp;</td>
							 </tr>
							 <tr>
								<td style="padding:0 35px;">
								   <h1>Xin chào ${name}</h1>
								   <span
									  style="display:inline-block; vertical-align:middle; margin:24px 0 22px; border-bottom:1px solid #cecece; width:100px;"></span>
								   <p>
									  Tài khoản boffice của bạn đã được kích hoạt thành công.
								   </p>
								   <p>
									  Bạn có thể bắt đầu đăng nhập vào hệ thống để sử dụng tại địa chỉ:
									  <a href="${url}">${url}</a>
								   </p>
								   <span style="display:inline-block; vertical-align:middle; margin: 8px;"></span>
								   <p>
									  Dưới đây là thông tin tài khoản của bạn, xin hãy bảo mật cẩn thận:
								   </p>
								   <span style="display:inline-block; vertical-align:middle; margin: 8px;"></span>
								   <table>
									  <tr>
										 <td>
											<p>Tài khoản:</p>
										 </td>
										 <td><strong>${email}</strong></td>
									  </tr>
									  <tr>
										 <td>
											<p>Mật khẩu:</p>
										 </td>
										 <td><strong>${password}</strong></td>
									  </tr>
								   </table>
								   <span style="display:inline-block; vertical-align:middle; margin: 8px;"></span>
								   <p>
									  Bạn vui lòng đổi mật khẩu sau khi đăng nhập lần đầu tiên để đảm bảo tính bảo
									  mật.
								   </p>
								</td>
							 </tr>
							 <tr>
								<td style="height:40px;">&nbsp;</td>
							 </tr>
						  </table>
					   </td>
					<tr>
					   <td style="height:20px;">&nbsp;</td>
					</tr>
					<tr>
					   <td style="text-align:center;">
						  <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">
							 &copy; <strong>${url}</strong>
						  </p>
					   </td>
					</tr>
					<tr>
					   <td style="height:80px;">&nbsp;</td>
					</tr>
				 </table>
			  </td>
		   </tr>
		</table>
		<!--/100% body table-->
	 </body>
  </html>`;
};

export const newUserMailTemplate2 = (
  name: string,
  email: string,
  otp: string,
): string => {
  return `<!doctype html>
	<html lang="en-US">
	   <head>
		  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
		  <title>Account info</title>
		  <meta name="description" content="Create account infomation.">
		  <style type="text/css">
			 a:hover {
			 text-decoration: underline !important;
			 }
			 h1 {
			 color: #1e1e2d;
			 font-weight: 500;
			 margin: 0;
			 font-size: 28px;
			 font-family: 'Rubik', sans-serif;
			 }
			 p {
			 color: #455056;
			 font-size: 15px;
			 line-height: 24px;
			 margin: 0;
			 }
		  </style>
	   </head>
	   <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
			<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
				cellpadding="0" cellspacing="0">
				<tr>
					<td>
					<table width="100%" border="0" cellpadding="0" cellspacing="0"
						style="max-width:670px;background:#fff; border-radius:3px;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
						<tr>
							<td style="height:40px;">&nbsp;</td>
						</tr>
						<tr>
							<td style="padding:0 35px;">
								<h1>Xin chào ${name}</h1>
								<span
								style="display:inline-block; vertical-align:middle; margin:24px 0 22px; border-bottom:1px solid #cecece; width:100px;"></span>
								<p>
								Tài khoản CoolMate của bạn đã được kích hoạt thành công.
								</p>
								<p>
								Bạn đã có thể bắt đầu đăng nhập vào ứng dụng CoolMate để có thể sử dụng các tính năng của ứng dụng.
								</p>
								<span style="display:inline-block; vertical-align:middle; margin: 8px;"></span>
								<p>
								Dưới đây là thông tin tài khoản của bạn, xin hãy bảo mật cẩn thận:
								</p>
								<span style="display:inline-block; vertical-align:middle; margin: 8px;"></span>
								<table>
								<tr>
									<td>
										<p>Tài khoản:</p>
									</td>
									<td><strong>${email}</strong></td>
								</tr>
								<tr>
									<td>
										<p>OTP:</p>
									</td>
									<td><strong>${otp}</strong></td>
								</tr>
								</table>
								<span style="display:inline-block; vertical-align:middle; margin: 8px;"></span>
							</td>
						</tr>
						<tr>
							<td style="height:40px;">&nbsp;</td>
						</tr>
					</table>
				</td>
			 </tr>
		  </table>
		  <!--/100% body table-->
	   </body>
	</html>`;
};

export const resetPasswordSubject = '[CoolMate] QUÊN MẬT KHẨU';

export const resetPasswordTemplate = (name: string, otp: string) => {
  return `<div class=""><div class="aHl"></div><div id=":171" tabindex="-1"></div><div id=":15x" class="ii gt"><div id=":15y" class="a3s aiL "><div class="adM">
  </div><div style="color:black;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#f9f9f9"><div class="adM">
	</div><div style="padding:3rem"><div class="adM">
	  </div><div><div class="adM">
		</div><header style="display:flex;max-width:10rem;margin:auto;padding:0.5rem;border-radius:0.15rem">
		</header>
		<u></u>
		  <p>Dear ${name},</p>
		  <p>
			Your <span class="il">password</span> reset OTP is:
		  </p>
		  <h2 style="text-align:center;font-family:Lato,sans-serif;margin-bottom:0.5rem;font-weight:500;line-height:1.2;font-size:2rem">
			${otp}
		  </h2>
		  <p style="text-align:justify">Please ignore this message if you  did not initiate this request</p>
		<u></u>
		<footer style="text-align:left;margin-bottom:0">
		</footer>
	  </div>
	</div>
</div></div></div><div id=":175" class="ii gt" style="display:none"><div id=":176" class="a3s aiL "></div></div><div class="hi"></div></div>`;
};
