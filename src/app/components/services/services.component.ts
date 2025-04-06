import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: {
    category: string;
    title: string;
    description: string;
    image: string;
  }[] = [
    {
      category: 'plomberie', // slug cohérent
      title: 'Plomberie & Dépannage',
      description: 'Nous intervenons rapidement pour l’installation, la réparation et le dépannage de votre plomberie domestique, avec professionnalisme et fiabilité.',
      image: 'assets/images/plumbing1.png'
    },
    {
      category: 'electricite', // slug cohérent
      title: 'Service d’installation de chaudière à gaz',
      description: 'Service spécialisé dans l’installation et l’entretien de chaudières à gaz, garantissant performance et sécurité.',
      image: 'assets/images/repair1.jpeg'
    },
    {
      category: 'nettoyage',
      title: 'Service d’Entretien à Domicile',
      description: 'On s’occupe de votre ménage, repassage et entretien régulier pour que vous profitiez pleinement de votre temps.',
      image: 'assets/images/nettoyage1.jpeg'
    },
    {
      category: 'jardinage',
      title: 'Service de Pose de gazon en rouleau',
      description: 'Pose professionnelle de gazon en rouleau pour un aménagement paysager soigné et rapide.',
      image: 'assets/images/jardinage1.jpeg'
    }
  ];

  filteredServices: {
    category: string;
    title: string;
    description: string;
    image: string;
  }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categorySlug = params['category'];

      if (categorySlug) {
        this.filteredServices = this.services.filter(
          service => service.category === categorySlug
        );
      } else {
        this.filteredServices = this.services;
      }
    });
  }
}
