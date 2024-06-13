<script lang="ts">
  // Function to open the modal
  const openModal = (modal: HTMLElement) => {
    modal.classList.remove('hidden');
  };

  // Function to close the modal
  const closeModal = (modal: HTMLElement) => {
    modal.classList.add('hidden');
  };

  // Main function to initialize modal functionality
  const initializeModal = () => {
    const modal = document.getElementById('crypto-modal');
    const button = document.querySelector('[data-modal-toggle="crypto-modal"]');

    if (modal && button) {
      // Add event listener to the button to open the modal
      button.addEventListener('click', () => openModal(modal));

      // Add event listener to close the modal when clicking outside of it
      window.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal(modal);
        }
      });

      // Close modal on 'Escape' key press
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeModal(modal);
        }
      });

      // Optional: Close modal on 'X' button click inside the modal
      const closeButton = modal.querySelector('.close-modal-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => closeModal(modal));
      }
    }
  };

  // Initialize the modal functionality when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', initializeModal);

  /************
   * handles dropdown top-right menu
   */

  document.addEventListener('DOMContentLoaded', function () {
    const dropdownMenuIconButton = document.getElementById('dropdownMenuIconButton');
    const dropdownDots = document.getElementById('dropdownDots');

    dropdownMenuIconButton.addEventListener('click', function (event) {
      event.stopPropagation();
      console.log('Dropdown button clicked');
      dropdownDots.classList.toggle('hidden');
    });

    document.body.addEventListener('click', function (event) {
      if (!dropdownDots.contains(event.target) && !dropdownMenuIconButton.contains(event.target)) {
        if (!dropdownDots.classList.contains('hidden')) {
          console.log('Clicked outside dropdown');
          dropdownDots.classList.add('hidden');
        }
      }
    });

    dropdownDots.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });
</script>


<button type="button" data-modal-target="crypto-modal" data-modal-toggle="crypto-modal" class="mr-1 text-gray-900 bg-gray-100 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
  <svg aria-hidden="true" class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
  Connect
</button>


<div class="relative inline-block">
  <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" class="inline-flex items-center p-2.5 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100" type="button">
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
      <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
    </svg>
  </button>

  <!-- Dropdown menu -->
  <div id="dropdownDots" class="absolute right-0 top-14 z-10 hidden bg-gray-100 divide-y divide-gray-200 rounded-lg shadow-2xl w-52 border-gray-200 border-4">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">About</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
      </li>
    </ul>
    <div class="py-2">
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Disconnect</a>
    </div>
  </div>
</div>


<!-- Main modal -->
<div id="crypto-modal" tabindex="-1" aria-hidden="true" class="hidden bg-gray-900/[.36] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full">
  <div class="relative p-4 w-full mx-auto flex items-center content-center max-w-sm max-h-full h-full">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Connect wallet
        </h3>
        <button type="button" class="close-modal-button text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crypto-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-5">
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of our available wallet providers.</p>
        <ul class="my-4 space-y-3">
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <svg class="h-3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 358.8 179.8" style="enable-background:new 0 0 358.8 179.8;" xml:space="preserve">
                <style type="text/css">
                  .st0{fill:url(#SVGID_1_);}
                  .st1{fill:url(#SVGID_2_);}
                  .st2{fill-rule:evenodd;clip-rule:evenodd;fill:#29ABE2;}
                </style>
                <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="224.7853" y1="257.7536" x2="348.0663" y2="133.4581" gradientTransform="matrix(1 0 0 -1 0 272)">
                  <stop offset="0.21" style="stop-color:#F15A24"/>
                  <stop offset="0.6841" style="stop-color:#FBB03B"/>
                </linearGradient>
                  <path class="st0" d="M271.6,0c-20,0-41.9,10.9-65,32.4c-10.9,10.1-20.5,21.1-27.5,29.8c0,0,11.2,12.9,23.5,26.8  c6.7-8.4,16.2-19.8,27.3-30.1c20.5-19.2,33.9-23.1,41.6-23.1c28.8,0,52.2,24.2,52.2,54.1c0,29.6-23.4,53.8-52.2,54.1  c-1.4,0-3-0.2-5-0.6c8.4,3.9,17.5,6.7,26,6.7c52.8,0,63.2-36.5,63.8-39.1c1.5-6.7,2.4-13.7,2.4-20.9C358.6,40.4,319.6,0,271.6,0z"/>
                <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="133.9461" y1="106.4262" x2="10.6653" y2="230.7215" gradientTransform="matrix(1 0 0 -1 0 272)">
                  <stop offset="0.21" style="stop-color:#ED1E79"/>
                  <stop offset="0.8929" style="stop-color:#522785"/>
                </linearGradient>
                  <path class="st1" d="M87.1,179.8c20,0,41.9-10.9,65-32.4c10.9-10.1,20.5-21.1,27.5-29.8c0,0-11.2-12.9-23.5-26.8  c-6.7,8.4-16.2,19.8-27.3,30.1c-20.5,19-34,23.1-41.6,23.1c-28.8,0-52.2-24.2-52.2-54.1c0-29.6,23.4-53.8,52.2-54.1  c1.4,0,3,0.2,5,0.6c-8.4-3.9-17.5-6.7-26-6.7C13.4,29.6,3,66.1,2.4,68.8C0.9,75.5,0,82.5,0,89.7C0,139.4,39,179.8,87.1,179.8z"/>
                  <path class="st2" d="M127.3,59.7c-5.8-5.6-34-28.5-61-29.3C18.1,29.2,4,64.2,2.7,68.7C12,29.5,46.4,0.2,87.2,0  c33.3,0,67,32.7,91.9,62.2c0,0,0.1-0.1,0.1-0.1c0,0,11.2,12.9,23.5,26.8c0,0,14,16.5,28.8,31c5.8,5.6,33.9,28.2,60.9,29  c49.5,1.4,63.2-35.6,63.9-38.4c-9.1,39.5-43.6,68.9-84.6,69.1c-33.3,0-67-32.7-92-62.2c0,0.1-0.1,0.1-0.1,0.2  c0,0-11.2-12.9-23.5-26.8C156.2,90.8,142.2,74.2,127.3,59.7z M2.7,69.1c0-0.1,0-0.2,0.1-0.3C2.7,68.9,2.7,69,2.7,69.1z"/>
                </svg>
              <span class="flex-1 ms-3 whitespace-nowrap">Internet Identity</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <img class="h-5" src="../../src/DeVinci_frontend/assets/nfid.webp"  alt="nfid wallet" />
              <span class="flex-1 ms-3 whitespace-nowrap">NFID (incl. Google)</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <svg class="h-5" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1080 540C1080 838.234 838.234 1080 540 1080C241.766 1080 0 838.234 0 540C0 241.766 241.766 0 540 0C838.234 0 1080 241.766 1080 540ZM540 1050.41C821.892 1050.41 1050.41 821.892 1050.41 540C1050.41 258.108 821.892 29.589 540 29.589C258.108 29.589 29.589 258.108 29.589 540C29.589 821.892 258.108 1050.41 540 1050.41Z" fill="url(#paint0_linear_28_125)"></path><mask id="mask0_28_125" maskUnits="userSpaceOnUse" x="31" y="29" width="1020" height="1020" style="mask-type: alpha;"><circle cx="541" cy="539" r="510" fill="#D9D9D9"></circle></mask><g mask="url(#mask0_28_125)"><circle cx="541" cy="539" r="540.824" fill="#00013A" stroke="url(#paint1_linear_28_125)" stroke-width="61.6484"></circle><g filter="url(#filter0_f_28_125)"><g filter="url(#filter1_f_28_125)"><ellipse cx="733.018" cy="1358.61" rx="993.649" ry="507.501" transform="rotate(-6.48121 733.018 1358.61)" fill="#783DFF"></ellipse></g><g filter="url(#filter2_f_28_125)"><path d="M1427.81 936.232C1561.01 848.432 1599.76 758.379 1695.91 633.491C1881.52 392.416 1883.85 190.314 2083.77 -39.7105C2491.68 -509.061 2222.72 1340.08 1595.83 1466.54C1201.75 1546.04 242.744 1248.51 616.218 1107.81C765.371 1051.62 870.102 1101.67 1027.26 1069.04C1189.46 1035.35 1291.89 1025.83 1427.81 936.232Z" fill="url(#paint2_linear_28_125)"></path></g><g filter="url(#filter3_f_28_125)"><path d="M-603.529 1076.3C-910.327 1087.12 -1109.62 1162.19 -1302.02 1339.39C-1691.78 1698.39 616.474 1835.36 289.7 1433.85C83.6632 1180.69 -211.651 1062.48 -603.529 1076.3Z" fill="#006FFF"></path></g><g filter="url(#filter4_f_28_125)"><path d="M-379.764 1113.3C-577.502 1126.31 -706.559 1199.3 -832.089 1369.12C-1086.39 1713.15 399.383 1822.43 192.464 1444.48C61.9973 1206.17 -127.189 1096.68 -379.764 1113.3Z" fill="#00FFFF"></path></g></g><g filter="url(#filter5_f_28_125)"><g filter="url(#filter6_f_28_125)"><path d="M-599.617 1501.42C-301.428 1574.39 -121.561 1688.41 30.7895 1901.03C339.423 2331.77 -1948.47 1996.57 -1546.89 1669.89C-1293.68 1463.91 -980.5 1408.21 -599.617 1501.42Z" fill="#006FFF"></path></g><path d="M-826.233 1492.15C-635.27 1545.09 -523.749 1642.79 -435.369 1834.59C-256.328 2223.14 -1733.28 2028.06 -1453.84 1700.07C-1277.65 1493.27 -1070.15 1424.52 -826.233 1492.15Z" fill="#00FFFF"></path></g></g><g clip-path="url(#clip0_28_125)"><path d="M120.569 540.415C120.566 579.092 132.033 616.9 153.519 649.059C175.005 681.219 205.545 706.284 241.277 721.085C277.01 735.886 316.328 739.758 354.262 732.212C392.195 724.666 427.038 706.04 454.385 678.691L455.432 677.294L664.941 441.248C677.81 428.351 693.106 418.131 709.948 411.178C726.789 404.226 744.841 400.679 763.06 400.743C800.103 400.743 835.63 415.459 861.823 441.652C888.017 467.846 902.732 503.372 902.732 540.415C902.732 577.459 888.017 612.985 861.823 639.178C835.63 665.372 800.103 680.087 763.06 680.087C744.841 680.151 726.789 676.605 709.948 669.652C693.106 662.7 677.81 652.48 664.941 639.582L635.26 606.061C630.352 600.505 623.437 597.126 616.038 596.667C608.638 596.209 601.359 598.709 595.803 603.617C590.246 608.525 586.867 615.44 586.409 622.839C585.95 630.239 588.45 637.518 593.359 643.074L623.737 677.294L624.785 678.691C642.943 696.85 664.5 711.256 688.225 721.084C711.951 730.912 737.38 735.97 763.06 735.97C788.741 735.97 814.17 730.912 837.895 721.084C861.62 711.256 883.178 696.85 901.335 678.691C928.685 651.344 947.311 616.5 954.857 578.567C962.403 540.634 958.531 501.315 943.73 465.583C928.929 429.851 903.863 399.311 871.704 377.825C839.545 356.338 801.737 344.872 763.06 344.874C737.367 344.777 711.91 349.789 688.171 359.62C664.433 369.451 642.886 383.905 624.785 402.14L623.737 403.537L414.229 639.582C401.36 652.48 386.063 662.7 369.222 669.652C352.381 676.605 334.329 680.151 316.11 680.087C279.066 680.087 243.54 665.372 217.346 639.178C191.153 612.985 176.438 577.459 176.438 540.415C176.438 503.372 191.153 467.846 217.346 441.652C243.54 415.459 279.066 400.743 316.11 400.743C334.329 400.679 352.381 404.226 369.222 411.178C386.063 418.131 401.36 428.351 414.229 441.248L443.91 474.769C448.818 480.326 455.732 483.705 463.132 484.163C470.532 484.622 477.81 482.122 483.367 477.214C488.923 472.305 492.302 465.391 492.761 457.991C493.219 450.592 490.719 443.313 485.811 437.756L455.432 403.537L454.385 402.14C427.038 374.79 392.195 356.165 354.262 348.618C316.328 341.072 277.01 344.945 241.277 359.746C205.545 374.547 175.005 399.612 153.519 431.771C132.033 463.93 120.566 501.739 120.569 540.415Z" fill="url(#paint3_angular_28_125)"></path><path d="M296.121 590.221V579.148H279.511V568.075H290.584V512.71H279.511V501.637H296.121V490.564H307.194V501.637H318.267V490.564H329.34V502.329C334.139 503.621 338.106 506.226 341.244 510.146C344.381 514.07 345.95 518.615 345.95 523.783C345.95 526.459 345.488 529.019 344.566 531.462C343.643 533.909 342.351 536.102 340.69 538.04C343.92 539.977 346.526 542.607 348.508 545.929C350.493 549.251 351.486 552.942 351.486 557.002C351.486 563.092 349.318 568.306 344.981 572.643C340.644 576.98 335.43 579.148 329.34 579.148V590.221H318.267V579.148H307.194V590.221H296.121ZM301.657 534.856H323.804C326.849 534.856 329.456 533.771 331.627 531.601C333.793 529.434 334.877 526.828 334.877 523.783C334.877 520.738 333.793 518.13 331.627 515.96C329.456 513.793 326.849 512.71 323.804 512.71H301.657V534.856ZM301.657 568.075H329.34C332.385 568.075 334.993 566.992 337.163 564.825C339.33 562.655 340.413 560.047 340.413 557.002C340.413 553.957 339.33 551.349 337.163 549.179C334.993 547.012 332.385 545.929 329.34 545.929H301.657V568.075Z" fill="#E3316E"></path><path d="M748.119 590.221V579.148H731.51V568.075H742.583V512.71H731.51V501.637H748.119V490.564H759.193V501.637H770.266V490.564H781.339V502.329C786.137 503.621 790.105 506.226 793.242 510.146C796.38 514.07 797.948 518.615 797.948 523.783C797.948 526.459 797.487 529.019 796.564 531.462C795.641 533.909 794.35 536.102 792.689 538.04C795.918 539.977 798.524 542.607 800.506 545.929C802.492 549.251 803.485 552.942 803.485 557.002C803.485 563.092 801.316 568.306 796.979 572.643C792.643 576.98 787.429 579.148 781.339 579.148V590.221H770.266V579.148H759.193V590.221H748.119ZM753.656 534.856H775.802C778.847 534.856 781.455 533.771 783.625 531.601C785.792 529.434 786.875 526.828 786.875 523.783C786.875 520.738 785.792 518.13 783.625 515.96C781.455 513.793 778.847 512.71 775.802 512.71H753.656V534.856ZM753.656 568.075H781.339C784.384 568.075 786.992 566.992 789.162 564.825C791.328 562.655 792.412 560.047 792.412 557.002C792.412 553.957 791.328 551.349 789.162 549.179C786.992 547.012 784.384 545.929 781.339 545.929H753.656V568.075Z" fill="#29ABE2"></path></g><defs><filter id="filter0_f_28_125" x="-1776.42" y="-933.328" width="5042.9" height="3238.54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="214.956" result="effect1_foregroundBlur_28_125"></feGaussianBlur></filter><filter id="filter1_f_28_125" x="-690.976" y="406.916" width="2847.99" height="1903.39" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="217.502" result="effect1_foregroundBlur_28_125"></feGaussianBlur></filter><filter id="filter2_f_28_125" x="168.995" y="-478.345" width="2471.46" height="2320.67" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="181.252" result="effect1_foregroundBlur_28_125"></feGaussianBlur></filter><filter id="filter3_f_28_125" x="-1781.51" y="640.209" width="2538.02" height="1473.07" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="217.502" result="effect1_foregroundBlur_28_125"></feGaussianBlur></filter><filter id="filter4_f_28_125" x="-1151.47" y="821.653" width="1653.78" height="1150.26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="145.002" result="effect1_foregroundBlur_28_125"></feGaussianBlur></filter><filter id="filter5_f_28_125" x="-3682.93" y="-889.778" width="4172.37" height="3424.89" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="214.956" result="effect1_foregroundBlur_28_125"></feGaussianBlur></filter><filter id="filter6_f_28_125" x="-2029.35" y="1022.69" width="2523.88" height="1517.51" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="217.502" result="effect1_foregroundBlur_28_125"></feGaussianBlur></filter><linearGradient id="paint0_linear_28_125" x1="157.192" y1="121.747" x2="1007.88" y2="1050.41" gradientUnits="userSpaceOnUse"><stop stop-color="#CD478F"></stop><stop offset="0.234375" stop-color="white"></stop><stop offset="0.422577" stop-color="#7230FF"></stop><stop offset="0.661458" stop-color="#009BFF"></stop><stop offset="1" stop-color="white"></stop></linearGradient><linearGradient id="paint1_linear_28_125" x1="158.5" y1="121.083" x2="1008.5" y2="1049" gradientUnits="userSpaceOnUse"><stop stop-color="#CD478F"></stop><stop offset="0.234375" stop-color="white"></stop><stop offset="0.422577" stop-color="#7230FF"></stop><stop offset="0.661458" stop-color="#009BFF"></stop><stop offset="1" stop-color="white"></stop></linearGradient><linearGradient id="paint2_linear_28_125" x1="1813.2" y1="428.212" x2="1181.97" y2="1226.61" gradientUnits="userSpaceOnUse"><stop stop-color="#994C7D"></stop><stop offset="1" stop-color="#BD609B"></stop></linearGradient><radialGradient id="paint3_angular_28_125" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(459.786 540.414) rotate(27.3499) scale(130.293 273.893)"><stop offset="0.114066" stop-color="#29ABE2"></stop><stop offset="0.172608" stop-color="#29ABE2"></stop><stop offset="0.283514" stop-color="#EE2A67"></stop><stop offset="0.528748" stop-color="#522785"></stop><stop offset="0.638338" stop-color="#D71F7A"></stop><stop offset="0.923948" stop-color="#F9A137"></stop><stop offset="0.9928" stop-color="#29ABE2"></stop></radialGradient><clipPath id="clip0_28_125"><rect width="893.901" height="893.901" fill="white" transform="translate(92.6484 93.4506)"></rect></clipPath></defs></svg>
              <span class="flex-1 ms-3 whitespace-nowrap">Bitfinity</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <img class="h-6" src="../../src/DeVinci_frontend/assets/plug.webp"  alt="plug wallet" />
              <span class="flex-1 ms-3 whitespace-nowrap">Plug</span>
            </a>
          </li>
        </ul>
        <div>
          <a href="#" class="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
            <svg class="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Why do I need to connect with my wallet?</a>
        </div>
      </div>
    </div>
  </div>
</div>


<style>
</style>
