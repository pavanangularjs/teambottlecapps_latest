import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profile: any;
  profileImage: string;

  formEditProfile: FormGroup;
  constructor(private customerService: CustomerService, private router: Router,
    private toastr: ToastrService) {

    this.formEditProfile = new FormGroup({
      pFirstName: new FormControl('', [Validators.required]),
      pLastName: new FormControl(''),
      pContactNo: new FormControl('', [Validators.required]),
      pEmail: new FormControl('', [Validators.required, Validators.email]),
      pDOB: new FormControl(''),
      pGender: new FormControl('', [Validators.required]),
      pImage: new FormControl(''),
    });

    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        if (data) {
          this.profile = data;
          this.profileImage = this.profile.ProfileImage;
          this.initializeProfile();
        }
      });
  }

  ngOnInit() {

  }

  initializeProfile() {
    this.formEditProfile = new FormGroup({
      pFirstName: new FormControl(this.profile.FirstName, [Validators.required]),
      pLastName: new FormControl(this.profile.LastName),
      pContactNo: new FormControl(this.profile.ContactNo, [Validators.required]),
      pEmail: new FormControl(this.profile.EmailId, [Validators.required, Validators.email]),
      pDOB: new FormControl(this.profile.DOBDt),
      pGender: new FormControl(this.profile.Gender, [Validators.required]),
      pImage: new FormControl(this.profile.ProfileImage),
    });
  }

  uploadPicture(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ((e) => {
        this.profileImage = e.target['result'];
      });
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onProfileUpdate() {
    const profile = {
      FirstName: '', LastName: '', EmailId: '',
      ContactNo: '', DOB: '', Gender: '', UserIpAddress: '', ProfileImage: '',
      StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''
    };

    profile.FirstName = this.formEditProfile.get('pFirstName').value;
    profile.LastName = this.formEditProfile.get('pLastName').value;
    profile.ContactNo = this.formEditProfile.get('pContactNo').value;
    profile.EmailId = this.formEditProfile.get('pEmail').value;
    profile.DOB = this.formEditProfile.get('pDOB').value;
    profile.Gender = this.formEditProfile.get('pGender').value;
    profile.ProfileImage = this.formEditProfile.get('pImage').value;
    // profile.UserIpAddress = '';


    this.customerService.UploadImage(profile.ProfileImage).subscribe(data => {
      if (data && data.SuccessMessage) {
        this.profileImage = data.SuccessMessage;

        this.customerService.updateCustomerProfile(profile).subscribe(
          (res) => {
            this.router.navigate(['myaccount/profile']);
          });
      }
    });
  }

}
